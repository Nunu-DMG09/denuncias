<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\AdministradoresModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminController extends BaseController
{
    private $administradoresModel;
    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
    }
    public function registerPrueba()
    {
        // Primero verificamos si ya existe para evitar duplicados
        $existingAdmin = $this->administradoresModel->find('74887540');

        if ($existingAdmin) {
            return $this->response->setJSON([
                'message' => 'Administrador ya existe',
                'admin' => $existingAdmin
            ]);
        }

        $data = [
            'dni_admin' => '74887540',
            'nombres' => 'CASTRO PASTOR, DIEGO ALBERTO',
            'password' => password_hash('12345678', PASSWORD_DEFAULT),
            'categoria' => 'super_admin',
            'estado' => 'activo'
        ];

        $success = $this->administradoresModel->insert($data);

        return $this->response->setJSON([
            'message' => $success ? 'Administrador registrado' : 'Error al registrar',
            'success' => $success,
            'error' => $this->administradoresModel->errors()
        ]);
    }
    public function login()
    {
        $data = $this->request->getJSON(true);
        $dni_admin = $data['dni_admin'] ?? $data->dni_admin ?? '';
        $password = $data['password'] ?? $data->password ?? '';
        $user = $this->administradoresModel->find($dni_admin);

        if ($user && password_verify($password, $user['password'])) {
            $key = 'your-secret-key';
            $payload = [
                'iat' => time(),
                'exp' => time() + 3600,
                'dni_admin' => $user['dni_admin'],
                'categoria' => $user['categoria'],
                'nombre' => $user['nombres'] ?? 'Admin'
            ];
            $token = JWT::encode($payload, $key, 'HS256');
            return $this->response->setJSON(['token' => $token]);
        }

        // Mensaje de error más específico para depuración
        $errorMsg = !$user ? 'Usuario no encontrado' : 'Contraseña incorrecta';
        log_message('info', 'Error de login: ' . $errorMsg);

        return $this->response->setJSON(['error' => $errorMsg], 401);
    }
    public function getAdminInfo()
    {
        $authheader = $this->request->getHeaderLine('Authorization');
        if (!$authheader || !str_starts_with($authheader, 'Bearer ')) {
            return $this->response->setJSON(['error' => 'No autorizado'], 401);
        }

        $token = substr($authheader, 7);
        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $dni_admin = $decoded->dni_admin;
            $user = $this->administradoresModel->find($dni_admin);
            if (!$user) {
                return $this->response->setJSON(['error' => 'Usuario no encontrado'], 404);
            }
            if ($user['categoria'] !== $decoded->categoria) {
                $payload = [
                    'iat' => time(),
                    'exp' => time() + 3600,
                    'dni_admin' => $user['dni_admin'],
                    'categoria' => $user['categoria'],
                    'nombre' => $user['nombres'] ?? 'Admin'
                ];
                $newToken = JWT::encode($payload, $key, 'HS256');
                return $this->response->setJSON([
                    'user' => [
                        'dni_admin' => $user['dni_admin'],
                        'nombres' => $user['nombres'],
                        'categoria' => $user['categoria'],
                        'estado' => $user['estado']
                    ],
                    'token' => $newToken,
                    'roleChanged' => true
                ]);
            }
            return $this->response->setJSON([
                'user' => [
                    'dni_admin' => $user['dni_admin'],
                    'nombres' => $user['nombres'],
                    'categoria' => $user['categoria'],
                    'estado' => $user['estado']
                ],
                'roleChanged' => false
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Token inválido'], 401);
        }
    }
}
