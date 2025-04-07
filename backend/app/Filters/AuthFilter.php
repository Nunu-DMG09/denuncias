<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        } elseif (session()->has('token')) {
            $token = session()->get('token');
        }
        if (!$token) {
            return redirect()->to('/login')->with('error', 'Acceso no autorizado');
        }
        try {
            $decoded = JWT::decode($token, new Key('your-secret-key', 'HS256'));
            $dni_admin = $decoded->dni_admin;

            // Validate admin status and role from the database
            $administradoresModel = new \App\Models\AdministradoresModel();
            $user = $administradoresModel->find($dni_admin);

            if (!$user || $user['estado'] !== 'activo') {
                session()->destroy();
                return redirect()->to('/login')->with('error', 'Usuario inactivo o no autorizado');
            }

            if ($arguments && !in_array($user['categoria'], $arguments)) {
                return redirect()->to('/unauthorized')->with('error', 'Permisos insuficientes');
            }

            session()->set('categoria', $user['categoria']);
            service('request')->setGlobal('user', $user);
        } catch (\Exception $e) {
            session()->destroy();
            return redirect()->to('/login')->with('error', 'Token inválido o expirado');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
