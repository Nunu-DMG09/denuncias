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
        $token = service('request')->getCookie('auth_token');
        if (!$token) {
            return service('response')->setStatusCode(401)->setJSON(['error' => 'No autorizado']);
        }
        try {
            $decoded = JWT::decode($token, new Key('your-secret-key', 'HS256'));
            $dni_admin = $decoded->dni_admin;

            // Validate admin status and role from the database
            $administradoresModel = new \App\Models\Denuncias\AdministradoresModel();
            $user = $administradoresModel->find($dni_admin);

            if (!$user || $user['estado'] !== 'activo') return service('response')->setStatusCode(401)->setJSON(['error', 'Usuario inactivo o no autorizado', 'forceLogout' => true]);
            if ($arguments && !in_array($user['categoria'], $arguments)) return service('response')->setStatusCode(403)->setJSON(['error' => 'Permisos insuficientes']);

            session()->set('categoria', $user['categoria']);
            service('request')->setGlobal('user', $user);
        } catch (\Exception $e) {
            return service('response')->setStatusCode(401)->setJSON(['error' => 'Token inválido o expirado', 'forceLogout' => true]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
