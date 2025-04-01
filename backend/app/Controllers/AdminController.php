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
    public function login()
    {
        $data = $this->request->getJSON(true);
        $dni_admin = $data['dni_admin'] ?? $data->dni_admin ?? '';
        $password = $data['password'] ?? $data->password ?? '';
        $user = $this->administradoresModel
        ->find($dni_admin);
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
            session()->set('token', $token);
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
                session()->set('token', $newToken);
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
    public function getAdministradores()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT * FROM administradores');
        $result = $query->getResult();
        
        return $this->response->setJSON($result);
    }
    public function createAdministrador()
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
                    'error' => 'No tiene permisos para crear administradores'
                ])->setStatusCode(403);
            }

            $data = $this->request->getJSON(true);
            
            // Validar que todos los campos requeridos estén presentes
            if (!isset($data['dni_admin']) || !isset($data['nombres']) || !isset($data['password']) || !isset($data['categoria']) || !isset($data['estado'])) {
                return $this->response->setJSON([
                    'error' => 'Faltan campos requeridos'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un administrador con ese DNI
            $existingAdmin = $this->administradoresModel->find($data['dni_admin']);
            if ($existingAdmin) {
                return $this->response->setJSON([
                    'error' => 'Ya existe un administrador con ese DNI'
                ])->setStatusCode(400);
            }

            // Hashear la contraseña
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

            try {
                // Intentar insertar el nuevo administrador
                $success = $this->administradoresModel->insert($data);
                
                if ($success) {
                    // Obtener el administrador recién creado
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
    public function updateAdministrador($dni)
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
                    'error' => 'No tiene permisos para editar administradores'
                ])->setStatusCode(403);
            }

            // Verificar si existe el administrador
            $existingAdmin = $this->administradoresModel->find($dni);
            if (!$existingAdmin) {
                return $this->response->setJSON([
                    'error' => 'Administrador no encontrado'
                ])->setStatusCode(404);
            }

            $data = $this->request->getJSON(true);
            $updateData = [];

            // Actualizar solo los campos proporcionados
            if (isset($data['nombres'])) {
                $updateData['nombres'] = $data['nombres'];
            }
            if (isset($data['categoria'])) {
                $updateData['categoria'] = $data['categoria'];
            }
            if (isset($data['estado'])) {
                $updateData['estado'] = $data['estado'];
            }
            if (isset($data['password']) && !empty($data['password'])) {
                $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }

            try {
                // Intentar actualizar el administrador
                $success = $this->administradoresModel->update($dni, $updateData);
                
                if ($success) {
                    // Obtener el administrador actualizado
                    $updatedAdmin = $this->administradoresModel->find($dni);
                    return $this->response->setJSON($updatedAdmin);
                } else {
                    return $this->response->setJSON([
                        'error' => 'Error al actualizar el administrador'
                    ])->setStatusCode(500);
                }
            } catch (\Exception $e) {
                log_message('error', 'Error al actualizar administrador: ' . $e->getMessage());
                return $this->response->setJSON([
                    'error' => 'Error al actualizar el administrador'
                ])->setStatusCode(500);
            }
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