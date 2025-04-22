<?php

namespace App\Controllers\Denuncias\Admin;

use App\Controllers\BaseController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Denuncias\AdministradoresModel;

class VerificarController extends BaseController
{
    private $administradoresModel;

    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
    }
    //Funciones para el login y la verificación del token
    public function login()
    {
        $data = $this->request->getJSON(true);
        $dni_admin = $data['dni_admin'] ?? $data->dni_admin ?? '';
        $password = $data['password'] ?? $data->password ?? '';
        $user = $this->administradoresModel->find($dni_admin);

        // Verificar si el usuario existe
        if (!$user) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado']);
        }

        // Verificar si el usuario está activo
        if ($user['estado'] !== 'activo') {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Tu cuenta ha sido desactivada. Por favor, contacta al administrador.']);
        }

        if (password_verify($password, $user['password'])) {
            $key = 'your-secret-key';
            $payload = [
                'iat' => time(),
                'exp' => time() + 3600,
                'dni_admin' => $user['dni_admin'],
                'categoria' => $user['categoria'],
                'estado' => $user['estado']
            ];
            $token = JWT::encode($payload, $key, 'HS256');
            session()->set([
                'token' => $token,
                'dni_admin' => $user['dni_admin'],
                'categoria' => $user['categoria'],
                'estado' => $user['estado']
            ]);
            return $this->response->setJSON(['token' => $token]);
        }
        return $this->response->setStatusCode(401)->setJSON(['error' => 'Contraseña incorrecta']);
    }
    public function getAdminInfo()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'No autorizado', 'forceLogout' => true]);
        }
        $token = substr($authHeader, 7);
        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $dni_admin = $decoded->dni_admin;

            $user = $this->administradoresModel->find($dni_admin);
            if (!$user) {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado', 'forceLogout' => true]);
            }
            if ($user['estado'] !== 'activo') {
                return $this->response->setStatusCode(401)->setJSON([
                    'error' => 'Tu cuenta ha sido desactivada',
                    'forceLogout' => true
                ]);
            }
            if ($decoded->categoria !== $user['categoria'] || $decoded->estado !== $user['estado']) {
                $newPayload = [
                    'iat' => time(),
                    'exp' => time() + 3600,
                    'dni_admin' => $user['dni_admin'],
                    'categoria' => $user['categoria'],
                    'nombres' => $user['nombres'],
                    'estado' => $user['estado']
                ];
                $newToken = JWT::encode($newPayload, $key, 'HS256');

                return $this->response->setJSON([
                    'roleChanged' => true,
                    'token' => $newToken,
                    'user' => [
                        'dni_admin' => $user['dni_admin'],
                        'nombres' => $user['nombres'],
                        'categoria' => $user['categoria'],
                        'estado' => $user['estado']
                    ]
                ]);
            }
            return $this->response->setJSON([
                'roleChanged' => false,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(401)->setJSON([
                'error' => 'Token inválido o expirado',
                'forceLogout' => true
            ]);
        }
    }
}
