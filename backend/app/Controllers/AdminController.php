<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\AdministradoresModel;
use App\Models\Historial_adminModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminController extends BaseController
{
    private $administradoresModel;
    private $historialAdminModel;
    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
        $this->historialAdminModel = new Historial_adminModel();
    }
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
        $dni_admin = session()->get('dni_admin');
        if (!$dni_admin) {
            return $this->response->setJSON(['error' => 'No autorizado'], 401);
        }

        $user = $this->administradoresModel->find($dni_admin);
        if (!$user) {
            session()->destroy();
            return $this->response->setJSON(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar si el usuario está activo
        if ($user['estado'] !== 'activo') {
            session()->destroy();
            return $this->response->setJSON([
                'error' => 'Usuario inactivo',
                'forceLogout' => true
            ], 401);
        }

        // Check if the role has changed
        $roleChanged = session()->get('categoria') !== $user['categoria'];
        if ($roleChanged) {
            session()->set('categoria', $user['categoria']);
        }

        return $this->response->setJSON([
            'roleChanged' => $roleChanged
        ]);
    }
    public function getAdministradores()
    {
        $result = $this->administradoresModel
            ->findAll();
        if (!$result) {
            return $this->response->setJSON(['error' => 'No se encontraron administradores'], 404);
        }
        return $this->response->setJSON($result);
    }
    public function createAdministrador()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->response->setJSON(['error' => 'No autorizado'])->setStatusCode(401);
        }

        $token = substr($authHeader, 7);
        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            if ($decoded->categoria !== 'super_admin') {
                return $this->response->setJSON([
                    'error' => 'No tiene permisos para crear administradores'
                ])->setStatusCode(403);
            }

            $data = $this->request->getJSON(true);

            // Verificar si ya existe un administrador con ese DNI
            $existingAdmin = $this->administradoresModel->find($data['dni_admin']);
            if ($existingAdmin) {
                return $this->response->setJSON([
                    'error' => 'Ya existe un administrador con ese DNI'
                ])->setStatusCode(400);
            }
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            try {
                $success = $this->administradoresModel
                    ->insert($data);

                if ($success) {
                    $newAdmin = $this->administradoresModel->find($data['dni_admin']);
                    return $this->response->setJSON($newAdmin)->setStatusCode(201);
                } else {
                    return $this->response->setJSON([
                        'error' => 'Error al crear el administrador'
                    ])->setStatusCode(500);
                }
            } catch (\Exception $e) {
                log_message('error', 'Error al crear administrador: ' . $e->getMessage());
                return $this->response->setJSON([
                    'error' => 'Error al crear el administrador'
                ])->setStatusCode(500);
            }
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Token inválido'])->setStatusCode(401);
        }
    }
    public function updateAdministrador()
    {
        // Obtener el token del encabezado
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->response->setJSON(['error' => 'No autorizado'])->setStatusCode(401);
        }
        $token = substr($authHeader, 7);
        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            // Verificar que el usuario sea super_admin
            if ($decoded->categoria !== 'super_admin') {
                return $this->response->setJSON([
                    'error' => 'No tiene permisos para eliminar administradores'
                ])->setStatusCode(403);
            }

            $data = $this->request->getJSON(true);
            $accion = $data['accion'] ?? null;
            $dni_admin = $data['dni_admin'] ?? null;
            $dni = $data['dni'] ?? null;
            $motivo = $data['motivo'] ?? null;
            if (!$accion || !$dni_admin || !$dni || !$motivo) {
                return $this->response->setJSON([
                    'error' => 'Faltan parámetros obligatorios'
                ])->setStatusCode(400);
            }
            $adminToUpdate = $this->administradoresModel->find($dni);

            if (!$adminToUpdate) {
                return $this->response->setJSON([
                    'error' => 'Administrador no encontrado'
                ])->setStatusCode(404);
            }

            $historialData = [
                'dni_admin' => $dni_admin,
                'dni_objetivo' => $dni,
                'fecha' => date('Y-m-d H:i:s'),
                'motivo' => $motivo
            ];

            switch ($accion) {
                case 'estado':
                    
            }

        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Token inválido'])->setStatusCode(401);
        }
    }
    public function historyAdmin()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->response->setJSON(['error' => 'No autorizado'])->setStatusCode(401);
        }
        $token = substr($authHeader, 7);
        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            // Verificar que el usuario sea super_admin
            if ($decoded->categoria !== 'super_admin') {
                return $this->response->setJSON([
                    'error' => 'No tiene permisos para eliminar administradores'
                ])->setStatusCode(403);
            }
            $history = $this->historialAdminModel->findAll();
            if (!$history) {
                return $this->response->setJSON(['error' => 'No se encontraron registros de historial'], 404);
            }
            return $this->response->setJSON($history);
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Token inválido'])->setStatusCode(401);
        }
    }
}
// public function registerPrueba()
// {
//     $existingAdmin = $this->administradoresModel->find('76628500');
//     if ($existingAdmin) {
//         return $this->response->setJSON([
//             'message' => 'Administrador ya existe',
//             'admin' => $existingAdmin
//         ]);
//     }
//     $data = [
//         'dni_admin' => '76628500',
//         'nombres' => 'BURGA BRACAMONTE, JULIAN',
//         'password' => password_hash('12345678', PASSWORD_DEFAULT),
//         'categoria' => 'super_admin',
//         'estado' => 'activo'
//     ];
//     $success = $this->administradoresModel
//     ->insert($data);
//     return $success ? 'Administrador registrado' : 'Error al registrar administrador';
// }