<?php

namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use App\Controllers\BaseController;

use App\Models\denuncias_corrupcion\Denuncias\AdministradoresModel;
use App\Models\denuncias_corrupcion\Denuncias\HistorialAdminModel;

class GestionSuperAdmin extends BaseController
{
    //Funciones y constructores para la gestión de administradores

    private $administradoresModel;
    private $historialAdminModel;
    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
        $this->historialAdminModel = new HistorialAdminModel();
    }
    public function generateId($table)
    {
        $prefixes = [
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
    // Funciónes para los super administradores
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
    }
    public function updateAdministrador()
    {
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
            'fecha_accion' => date('Y-m-d H:i:s', strtotime('-5 hours')),
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
        $history = $this->historialAdminModel
            ->select('historial_admin.*, administradores.nombres AS admin_nombre, administradores.categoria AS admin_categoria')
            ->join('administradores', 'historial_admin.dni_admin = administradores.dni_admin', 'left')
            ->findAll();
        if (!$history) {
            return $this->response->setJSON(['error' => 'No se encontraron registros de historial'], 404);
        }
        return $this->response->setJSON($history);
    }
}
