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
    public function generateId($table)
    {
        $prefixes = [
            'denuncias' => 'de',
            'denunciantes' => 'dn',
            'denunciados' => 'de',
            'adjuntos' => 'ad',
            'seguimientoDenuncias' => 'sd',
            'historialAdmin' => 'ha'
        ];
        if (!isset($prefixes[$table])) {
            throw new \InvalidArgumentException("Invalid table name: $table");
        }
        $model = $this->{$table . 'Model'};
        $prefix = $prefixes[$table];
        do {
            $uuid = $prefix . substr(bin2hex(random_bytes(6)), 0, 6);
        } while ($model->where('id', $uuid)->first());
        return $uuid;
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
                'id' => $this->generateId('historialAdmin'),
                'realizado_por' => $dni_admin,
                'dni_admin' => $dni,
                'fecha_accion' => date('Y-m-d H:i:s'),
                'accion' => $accion,
                'motivo' => $motivo
            ];

            switch ($accion) {
                case 'estado':
                    $estado = $data['estado'] ?? null;
                    if (!$estado || !in_array($estado, ['activo', 'inactivo'])) {
                        return $this->response->setJSON([
                            'error' => 'Falta el estado'
                        ])->setStatusCode(400);
                    }
                    $updateResult = $this->administradoresModel
                        ->update($dni, ['estado' => $estado]);
                    if (!$updateResult) {
                        return $this->response->setJSON([
                            'error' => 'No se pudo actualizar el estado del administrador'
                        ])->setStatusCode(500);
                    }

                    $this->historialAdminModel
                        ->insert($historialData);
                    return $this->response->setJSON([
                        'message' => 'Estado actualizado correctamente',
                        'estado' => $estado,
                        'admin' => $this->administradoresModel->find($dni)
                    ])->setStatusCode(200);
                    break;
                case 'categoria':
                    $categoria = $data['categoria'] ?? null;
                    if (!$categoria || !in_array($categoria, ['admin', 'super_admin'])) {
                        return $this->response->setJSON([
                            'error' => 'Falta la categoría'
                        ])->setStatusCode(400);
                    }
                    $updateResult = $this->administradoresModel
                        ->update($dni, ['categoria' => $categoria]);
                    if (!$updateResult) {
                        return $this->response->setJSON([
                            'error' => 'No se pudo actualizar la categoría del administrador'
                        ])->setStatusCode(500);
                    }

                    $this->historialAdminModel
                        ->insert($historialData);
                    return $this->response->setJSON([
                        'message' => 'Categoría actualizada correctamente',
                        'categoria' => $categoria,
                        'admin' => $this->administradoresModel->find($dni)
                    ])->setStatusCode(200);
                    break;

                case 'password':
                    $password = $data['password'] ?? null;
                    if (!$password) {
                        return $this->response->setJSON([
                            'error' => 'Falta la contraseña'
                        ])->setStatusCode(400);
                    }
                    $updateResult = $this->administradoresModel
                        ->update($dni, ['password' => password_hash($password, PASSWORD_DEFAULT)]);
                    if (!$updateResult) {
                        return $this->response->setJSON([
                            'error' => 'No se pudo actualizar la contraseña del administrador'
                        ])->setStatusCode(500);
                    }

                    $this->historialAdminModel
                        ->insert($historialData);
                    return $this->response->setJSON([
                        'message' => 'Contraseña actualizada correctamente',
                        'admin' => $this->administradoresModel->find($dni)
                    ])->setStatusCode(200);
                    break;
                default:
                    return $this->response->setJSON([
                        'error' => 'Acción no válida'
                    ])->setStatusCode(400);
            }
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Token inválido'])->setStatusCode(401);
        }
    }
    public function searchAdmin()
    {
        $dni = $this->request->getGet('dni_admin');
        if (!$dni) {
            return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
        }
        $admin = $this->administradoresModel->find($dni);
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }
        return $this->response->setJSON($admin);
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