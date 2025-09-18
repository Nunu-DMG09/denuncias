<?php

namespace App\Controllers\denuncias_consumidor\DenunciasConsumidor\v1;

use CodeIgniter\RESTful\ResourceController;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\DenunciadoModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\AdjuntoModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\AdministradorModel;
use App\Controllers\denuncias_consumidor\DenunciasConsumidor\v1\AuthController;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\HistorialAdminModel;
use CodeIgniter\Config\Services;
use App\Services\MailService;

class AdminsController extends ResourceController
{
    // Models
    private $denuncianteModel;
    private $denunciaModel;
    private $denunciadoModel;
    private $seguimientoDenunciaModel;
    private $adminModel;
    private $adjuntoModel;
    private $historialModel;

    // Utils
    private $email;
    private $AuthController;

    public function __construct()
    {
        // Modelos de denuncias
        $this->denuncianteModel          = new DenuncianteModel();
        $this->denunciaModel             = new DenunciaModel();
        $this->seguimientoDenunciaModel  = new SeguimientoDenunciaModel();
        $this->adjuntoModel              = new AdjuntoModel();
        $this->denunciadoModel           = new DenunciadoModel();

        // Modelos de admins
        $this->adminModel     = new AdministradorModel();
        $this->historialModel = new HistorialAdminModel();

        // Servicios
        $this->email         = Services::email();
        $this->AuthController = new AuthController();
    }

    //===========================
    // VERIFICAR AUTENTICACION
    //===========================
    private function authAdmin()
    {
        $token = get_cookie('access_token');

        if (!$token) {
            return $this->respond(['error' => 'No autenticado'], 401);
        }

        try {
            $decoded = verifyJWT($token);

            if (!isset($decoded->data->dni)) {
                return $this->respond(['error' => 'Token inválido'], 401);
            }

            // Buscar el admin en la BD
            $adminModel = new \App\Models\denuncias_consumidor\DenunciasConsumidor\v1\AdministradorModel();
            $admin = $adminModel->where('dni', $decoded->data->dni)->first();

            if (!$admin) {
                return $this->respond(['error' => 'Admin no encontrado'], 404);
            }

            return $admin; 


        } catch (\Throwable $e) {
            return $this->respond(['error' => 'Token inválido: ' . $e->getMessage()], 401);
        }
    }

    //====================================
    // METODOS PRIVADO DE LA CLASE
    //==================================== 
    private function isSuperAdmin($admin)
    {
        return isset($admin['rol']) && $admin['rol'] === 'super_admin';
    }

    private function isAdmin($admin)
    {
        return isset($admin['rol']) && $admin['rol'] === 'admin';
    }

    private function registrarHistorial($adminId, $afectadoId, $accion, $motivo)
    {
        $this->historialModel->insert([
            'administrador_id' => $adminId,
            'afectado_id'      => $afectadoId,
            'accion'           => $accion,
            'motivo'           => $motivo
        ]);
    }

    //🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
    //===========================
    // FUNCIONES PARA ADMINS
    //===========================
    //🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟

    public function recibirAdmin()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true); 
        $code       = $input['tracking_code'] ?? null;
        $estado     = 'recibida'; 
        $comentario = 'La denuncia ha sido recibida por el administrador'; 

        if (empty($code)) {
            return $this->fail(['message' => 'Falta el código de seguimiento o tracking_code']);
        }

        $seguimientoData = [
            'administrador_id' => $admin['id'],
            'estado'           => $estado,
            'comentario'       => $comentario,
        ];

        $resultado = $this->denunciaModel->recibirDenuncia($code, $estado, $comentario, $seguimientoData);

        if (!$resultado) {
            return $this->respond(['success' => false, 'message' => 'No se encontró la denuncia.'], 404);
        }

        $denuncia = $resultado['denuncia'];
        $correo = $this->denuncianteModel->select('email')->where('id', $denuncia['denunciante_id'])->first();

        if ($correo && !empty($correo['email'])) {
            $mailService = new MailService();
            $mailService->seguimientogMail($correo['email'], $code, $estado, $comentario);
        }

        return $this->respond([
            'success'    => true,
            'message'    => 'Denuncia recibida correctamente',
            'denuncia'   => $resultado['denuncia'],
            'seguimiento'=> $resultado['seguimiento']
        ], 200);
    }

    //============================================
    // FUNCION PARA PROCESAR DENUNCIAS POR EL ADMIN
    //============================================
    public function procesosDenuncia()
    {

        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true); 

        $code       = $input['tracking_code'] ?? null;
        $estado     = $input['estado'] ?? null;
        $comentario = $input['comentario'] ?? null;

        if (empty($code) || empty($estado) || empty($comentario)) {
            return $this->fail(['message' => 'Faltan parámetros requeridos']);
        }

        if (!$code) {
            return $this->fail(['message' => 'Falta el tracking_code en el request']);
        }

        $denuncia = $this->denunciaModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->fail(['message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id'     => $denuncia['id'],
            'administrador_id' => $admin['id'], 
            'comentario'      => $comentario,
            'estado'           => $estado,
        ]);

        $this->denunciaModel
            ->where('tracking_code', $code)
            ->set(['estado' => $estado])
            ->update();

        $correo = $this->denuncianteModel
            ->select('email')
            ->where('id', $denuncia['denunciante_id'])
            ->first();

        if ($correo && !empty($correo['email'])) {
            $mailService = new MailService();
            $mailService->seguimientogMail($correo['email'], $code, $estado, $comentario);
        }

        return $this->respond(['success' => true, 'message' => 'Denuncia actualizada']);
    }

    //=============================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR DOCUMENTO DEL DENUNCIANTE
    //==============================
    public function searchDenuncias($documento = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($documento)) {
            return $this->fail(['message' => 'Falta el parámetro documento']);
        }

        $denuncias = $this->denunciaModel->searchByDocumento($documento);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias con este documento']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    //===============================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR ID DEL DENUNCIANTE
    //===============================
    public function searchDenunciasByDenuncianteId($denuncianteId = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($denuncianteId)) {
            return $this->fail(['message' => 'Falta el parámetro denunciante_id']);
        }

        $denuncias = $this->denunciaModel->searchByDenuncianteId($denuncianteId);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias para este denunciante']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    
    //===========================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR DOCUMENTO DEL DENUNCIADO
    //===========================
    public function searchDenunciaByDocumentoDenunciado($documento = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($documento)) {
            return $this->fail(['message' => 'Falta el parámetro documento del denunciado']);
        }

        $denuncias = $this->denunciaModel->searchByDocumentoDenunciado($documento);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontró ninguna denuncia para este documento']);
        }

        // Construimos un array limpio para la respuesta CON HISTORIAL
        $data = array_map(function ($denuncia) {
            // Obtener historial de estados para cada denuncia
            $historial = $this->seguimientoDenunciaModel->HistorialEstados($denuncia['id']);
            
            return [
                'id'             => $denuncia['id'],
                'tracking_code'  => $denuncia['tracking_code'],
                'estado'         => $denuncia['estado'],
                'descripcion'    => $denuncia['descripcion'],
                'fecha_incidente'=> $denuncia['fecha_incidente'],
                'lugar'          => $denuncia['lugar'],
                'denunciante' => [
                    'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                    'documento' => $denuncia['documento_denunciante'] ?? 'No especificado',
                ],
                'denunciado' => [
                    'nombre'    => $denuncia['nombre_denunciado'],
                    'documento' => $denuncia['documento_denunciado'],
                ],
                'historial' => $historial,  // ✅ AGREGAR HISTORIAL
                'historial_count' => count($historial),
                'created_at' => $denuncia['created_at'],
            ];
        }, $denuncias);

        return $this->respond(['success' => true, 'data' => $data]);
    }

    //=============================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR NOMBRE DEL DENUNCIADO
    //=============================
    public function searchDenunciaByNombreDenunciado($nombre = null)
{
    $admin = $this->authAdmin();
    if (is_object($admin)) return $admin;

    if (empty($nombre)) {
        return $this->fail(['message' => 'Falta el parámetro nombre del denunciado']);
    }

    $denuncias = $this->denunciaModel->searchByNombreDenunciado($nombre);

    if (empty($denuncias)) {
        return $this->fail(['message' => 'No se encontró ninguna denuncia para este nombre']);
    }

    $data = array_map(function ($denuncia) {
        $historial = $this->seguimientoDenunciaModel->HistorialEstados($denuncia['id']);

        return [
            'id'             => $denuncia['id'],
            'tracking_code'  => $denuncia['tracking_code'],
            'estado'         => $denuncia['estado'],
            'descripcion'    => $denuncia['descripcion'],
            'fecha_incidente'=> $denuncia['fecha_incidente'],
            'lugar'          => $denuncia['lugar'],
            'denunciante' => [
                'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                'documento' => $denuncia['documento_denunciante'] ?? 'No especificado',
            ],
            'denunciado' => [
                'nombre'    => $denuncia['nombre_denunciado'],
                'documento' => $denuncia['documento_denunciado'],
                'tipo'      => strlen($denuncia['documento_denunciado']) === 11 ? 'Empresa (RUC)' : 'Persona',
            ],
            'historial'       => $historial,
            'historial_count' => count($historial),
            'created_at'      => $denuncia['created_at'],
        ];
    }, $denuncias);

    return $this->respond(['success' => true, 'data' => $data]);
}



    //=============================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR NOMBRE DEL DENUNCIANTE
    //=============================
    public function searchDenunciaByNombreDenunciante($nombre = null)
{
    $admin = $this->authAdmin();
    if (is_object($admin)) return $admin;

    if (empty($nombre)) {
        return $this->fail(['message' => 'Falta el parámetro nombre del denunciante']);
    }

    $denuncias = $this->denunciaModel->searchByNombreDenunciante($nombre);

    if (empty($denuncias)) {
        return $this->fail(['message' => 'No se encontró ninguna denuncia para este nombre']);
    }

    $data = array_map(function ($denuncia) {
        $historial = $this->seguimientoDenunciaModel->HistorialEstados($denuncia['id']);

        return [
            'id'             => $denuncia['id'],
            'tracking_code'  => $denuncia['tracking_code'],
            'estado'         => $denuncia['estado'],
            'descripcion'    => $denuncia['descripcion'],
            'fecha_incidente'=> $denuncia['fecha_incidente'],
            'lugar'          => $denuncia['lugar'],
            'denunciante' => [
                'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                'documento' => $denuncia['documento_denunciante'],
                'tipo'      => strlen($denuncia['documento_denunciante']) === 11 ? 'Empresa (RUC)' : 'Persona',
            ],
            'denunciado' => [
                'nombre'    => $denuncia['nombre_denunciado'] ?? 'Desconocido',
                'documento' => $denuncia['documento_denunciado'] ?? 'No especificado',
            ],
            'historial'       => $historial,
            'historial_count' => count($historial),
            'created_at'      => $denuncia['created_at'],
        ];
    }, $denuncias);

    return $this->respond(['success' => true, 'data' => $data]);
}



    //=============================
    // FUNCION PARA BUSCAR DENUNCIA 
    // POR DOCUMENTO DEL DENUNCIANTE
    //=============================
    public function searchDenunciaByDocumentoDenunciante($documento = null)
{
    $admin = $this->authAdmin();
    if (is_object($admin)) return $admin;

    if (empty($documento)) {
        return $this->fail(['message' => 'Falta el parámetro documento del denunciante']);
    }

    $denuncias = $this->denunciaModel->searchByDocumentoDenunciante($documento);

    if (empty($denuncias)) {
        return $this->fail(['message' => 'No se encontró ninguna denuncia para este documento']);
    }

    $data = array_map(function ($denuncia) {
        $historial = $this->seguimientoDenunciaModel->HistorialEstados($denuncia['id']);

        return [
            'id'             => $denuncia['id'],
            'tracking_code'  => $denuncia['tracking_code'],
            'estado'         => $denuncia['estado'],
            'descripcion'    => $denuncia['descripcion'],
            'fecha_incidente'=> $denuncia['fecha_incidente'],
            'lugar'          => $denuncia['lugar'],
            'denunciante' => [
                'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                'documento' => $denuncia['documento_denunciante'],
                'tipo'      => strlen($denuncia['documento_denunciante']) === 11 ? 'Empresa (RUC)' : 'Persona',
            ],
            'denunciado' => [
                'nombre'    => $denuncia['nombre_denunciado'] ?? 'Desconocido',
                'documento' => $denuncia['documento_denunciado'] ?? 'No especificado',
            ],
            'historial'       => $historial,
            'historial_count' => count($historial),
            'created_at'      => $denuncia['created_at'],
        ];
    }, $denuncias);

    return $this->respond(['success' => true, 'data' => $data]);
}



    //===========================================
    // FUNCION PARA LISTAR DENUNCIAS REGISTRADAS
    //===========================================
    public function getRegistradas()
    {
        $page = $this->request->getGet("page");
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = 10; 

        $denuncias = $this->denunciaModel->DenunciasRegistradas($perPage, $page);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias registradas']);
        }

        $pager = $this->denunciaModel->pager;

        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data' => array_map(function ($denuncia) {
                return [
                    'id' => $denuncia['id'],
                    'tracking_code' => $denuncia['tracking_code'],
                    'estado' => $denuncia['estado'],
                    'descripcion' => $denuncia['descripcion'],
                    'fecha_incidente' => $denuncia['fecha_incidente'],
                    'lugar' => $denuncia['lugar'],
                    'denunciante' => $denuncia['denunciante_nombre'] ?? 'Anónimo',
                    'denunciado' => $denuncia['denunciado_nombre'] ?? 'Desconocido',
                    'created_at' => $denuncia['created_at']
                ];
            }, $denuncias),
            'pager' => [
                'currentPage' => $page,
                'perPage' => $perPage,
                'total' => $pager->getTotal(),
                'pageCount' => ceil($pager->getTotal() / $perPage),
                'next' => $page < ceil($pager->getTotal() / $perPage) ? base_url("admin/registradas/" . ($page + 1)) : null,
                'prev' => $page > 1 ? base_url("admin/registradas/" . ($page - 1)) : null
            ]
        ]);
    }
    
    //========================================
    // FUNCION PARA LISTAR DENUNCIAS ACTIVAS
    //========================================
    public function getDenunciasActivas()
    {
        $page = $this->request->getGet("page");
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = 10; 

        $denuncias = $this->denunciaModel->DenunciasActivas($perPage, $page);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias activas']);
        }

        $pager = $this->denunciaModel->pager;

        $data = [];
        foreach ($denuncias as $denuncia) {
            // Conteos
            $historial = $this->seguimientoDenunciaModel->HistorialEstados($denuncia['id']);

            $adjuntosCount = $this->adjuntoModel
                ->where('denuncia_id', $denuncia['id'])
                ->countAllResults();

            $data[] = [
                'id'             => $denuncia['id'],
                'tracking_code'  => $denuncia['tracking_code'],
                'estado'         => $denuncia['estado'],
                'descripcion'    => $denuncia['descripcion'],
                'fecha_incidente'=> $denuncia['fecha_incidente'],
                'lugar'          => $denuncia['lugar'],
                'denunciante' => [
                    'nombre'    => $denuncia['denunciante_nombre']    ?? 'Anónimo',
                    'documento' => $denuncia['denunciante_documento'] ?? 'No especificado',
                ],
                'denunciado' => [
                    'nombre'    => $denuncia['denunciado_nombre']    ?? 'Desconocido',
                    'documento' => $denuncia['denunciado_documento'] ?? 'No especificado',
                ],
                'historial' => $historial,  
                'historial_count' => count($historial), 
                'adjuntos'  => $adjuntosCount,    
                'created_at'=> $denuncia['created_at'],
            ];
        }

        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data'    => $data,
            'pager'   => [
                'currentPage' => (int) $page,
                'perPage'     => (int) $perPage,
                'total'       => $pager->getTotal(),
                'pageCount'   => (int) ceil($pager->getTotal() / $perPage),
                'next'        => $page < ceil($pager->getTotal() / $perPage) ? base_url("admin/activas/" . ($page + 1)) : null,
                'prev'        => $page > 1 ? base_url("admin/activas/" . ($page - 1)) : null,
            ],
        ]);
    }

    //===============================================
    // FUNCION PARA ASIGNAR DENUNCIADO A UNA DENUNCIA
    //===============================================
    public function addDenunciadoPanel($denunciaId = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($denunciaId)) {
            return $this->fail(['message' => 'Falta el ID de la denuncia']);
        }

        $data = $this->request->getJSON(true); 

        // Validar que la denuncia existe
        $denuncia = $this->denunciaModel->find($denunciaId);
        if (!$denuncia) {
            return $this->fail(['message' => 'No se encontró la denuncia']);
        }

        // Si la denuncia ya tiene denunciado, evitar duplicar
        if (!empty($denuncia['denunciado_id'])) {
            return $this->fail(['message' => 'Esta denuncia ya tiene un denunciado asignado']);
        }

        // Crear denunciado (campos opcionales)
        $denunciadoData = [
            'nombre'             => $data['nombre'] ?? null,
            'razon_social'       => $data['razon_social'] ?? null,
            'documento'          => $data['documento'] ?? null,
            'tipo_documento'     => $data['tipo_documento'] ?? null,
            'representante_legal'=> $data['representante_legal'] ?? null,
            'direccion'          => $data['direccion'] ?? null,
            'celular'            => $data['celular'] ?? null,
        ];

        $denunciadoId = $this->denunciadoModel->insert($denunciadoData);

        if (!$denunciadoId) {
            return $this->fail(['message' => 'Error al registrar denunciado', 'errors' => $this->denunciadoModel->errors()]);
        }

        // Actualizar denuncia con el ID del denunciado
        $this->denunciaModel->update($denunciaId, ['denunciado_id' => $denunciadoId]);

        return $this->respond([
            'success'   => true,
            'message'   => 'Denunciado creado y asignado correctamente',
            'denunciado'=> $denunciadoData,
            'denuncia'  => $denunciaId
        ], 200);
    }


    //==============================================
    // FUNCION PARA OBTENER ESTADISTICAS DE DENUNCIAS
    //==============================================
    public function getDenunciasStats()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;
        $total = $this->denunciaModel->countAllResults();
        $pending = $this->denunciaModel->where('estado', 'registrado')->countAllResults();
        $inProcess = $this->denunciaModel->where('estado', 'en_proceso')->countAllResults();
        $closed = $this->denunciaModel->where('estado', 'finalizada')->countAllResults();
        $recieved = $this->denunciaModel->whereNotIn('estado', ['registrado'])->countAllResults();

        return $this->respond([
            'success' => true,
            'data' => [
                'total' => $total,
                'pending' => $pending,
                'in_process' => $inProcess,
                'closed' => $closed,
                'recieved' => $recieved
            ]
        ]);
    }

    //🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
    // ==========================
    // FUNCIONES PARA SUPER ADMINS
    // ==========================
    //🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟


    //=======================================
    // FUNCION PARA LISTAR ADMINISTRADORES
    //=======================================
    public function getAdministradores()
    {
        $admins = $this->adminModel->findAll();

        if (!$admins) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'No se encontraron administradores'])
                ->setStatusCode(404);
        }

        $filteredAdmins = array_map(function ($admin) {
            unset($admin['id'], $admin['password']);
            return $admin;
        }, $admins);

        return $this->response->setJSON([
            'success' => true,
            'data' => $filteredAdmins
        ])->setStatusCode(200);
    }

    //=======================================
    // FUNCION PARA CREAR ADMINISTRADORES
    //=======================================
    public function createAdministrador()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para crear administradores'], 403);
        }

        $input = $this->request->getJSON(true);

        $adminData = [
            'dni'      => $input['dni'] ?? null,
            'nombre'   => $input['nombre'] ?? null,
            'password' => isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : null,
            'rol'      => $input['rol'] ?? null,
            'estado'   => $input['estado'] ?? null,
        ];

        if (!empty($adminData['dni']) && $this->adminModel->getByDNI($adminData['dni'])) {
            return $this->fail([
                'success' => false,
                'error' => 'Ya existe un administrador con ese DNI'
            ], 400);
        }

        if ($this->adminModel->insert($adminData)) {
            $nuevoId = $this->adminModel->getInsertID();

            $this->registrarHistorial(
                $admin['id'],    
                $nuevoId,         
                'crear',
                'Creación de un nuevo administrador con DNI: ' . $adminData['dni']
            );

            return $this->respondCreated([
                'success' => true,
                'message' => 'Administrador registrado correctamente',
                'id'      => $nuevoId
            ], 200);
        }

        return $this->fail([
            'success' => false,
            'error' => 'Error al crear el administrador',
            'details' => $this->adminModel->errors()
        ], 500);
    }

    //========================================
    // FUNCION PARA ACTUALIZAR ADMINISTRADORES
    //========================================
    public function updateAdministrador($dni = null)
    {
        $adminAuth = $this->authAdmin();
        if (is_object($adminAuth)) return $adminAuth;

        if (!$this->isSuperAdmin($adminAuth)) {
            return $this->fail([
                'success' => false,
                'error' => 'No tienes permisos para actualizar administradores'
            ], 403);
        }

        if (!$dni) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'DNI no proporcionado'])
                ->setStatusCode(400);
        }

        $input = $this->request->getJSON(true);

        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->failNotFound("Administrador con DNI {$dni} no encontrado");
        }

        $allowedUpdateFields = ['password', 'estado', 'rol'];
        $data = array_intersect_key($input, array_flip($allowedUpdateFields));

        if (empty($data)) {
            return $this->failValidationErrors("Solo puedes actualizar password, estado o rol");
        }

        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if ($this->adminModel->where('dni', $dni)->set($data)->update()) {
            $adminUpdated = $this->adminModel->getByDNI($dni);
            unset($adminUpdated['id'], $adminUpdated['password']); 

            $mensajes = [];
            if (isset($data['password'])) {
                $mensajes[] = "Se actualizó la contraseña";
            }
            if (isset($data['rol'])) {
                $mensajes[] = "Se actualizó el rol a: " . $data['rol'];
            }
            if (isset($data['estado'])) {
                if ($data['estado'] == 1) {
                    $mensajes[] = "Se activó el usuario";
                } else {
                    $mensajes[] = "Se suspendió el usuario";
                }
            }

            $motivo = implode(' | ', $mensajes);

            $this->registrarHistorial(
                $adminAuth['id'], 
                $admin['id'],      
                'actualizar',
                $motivo
            );

            return $this->respondUpdated([
                'success' => true,
                'message' => "Administrador actualizado correctamente",
                'data'    => $adminUpdated
            ], 200);
        }

        return $this->fail("No se pudo actualizar el administrador");
    }

    //=============================================
    // FUNCION PARA ELIMINAR ADMINISTRADORES POR DNI
    //=============================================
    public function deleteAdministrador($dni)
    {
        $adminAuth = $this->authAdmin();
        if (is_object($adminAuth)) return $adminAuth;

        if (!$this->isSuperAdmin($adminAuth)) {
            return $this->fail(['error' => 'No tienes permisos para eliminar administradores'], 403);
        }

        if (!$dni) {
            return $this->fail(['error' => 'Debe proporcionar un DNI'], 400);
        }

        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->fail(['error' => 'Administrador no encontrado'], 404);
        }

        if ($this->adminModel->where('dni', $dni)->delete()) {
            $this->registrarHistorial(
                $adminAuth['id'],     
                $admin['id'],        
                'eliminar',
                'Eliminación del administrador con DNI: ' . $dni
            );

            return $this->respondDeleted([
                'message' => 'Administrador eliminado correctamente',
                'dni'     => $dni
            ], 200);
        }

        return $this->fail([
            'error' => 'No se pudo eliminar el administrador'
        ], 500);
    }

    //=============================================
    // FUNCION PARA ELIMINAR ADMINISTRADORES POR ID
    //=============================================
    public function deleteAdministradorById($id)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para eliminar administradores'], 403);
        }

        if (!$id) {
            return $this->fail(['error' => 'Debe proporcionar un ID'], 400);
        }

        $admin = $this->adminModel->find($id);
        if (!$admin) {
            return $this->fail(['error' => 'Administrador no encontrado'], 404);
        }

        if ($this->adminModel->delete($id)) {
            return $this->respondDeleted([
                'message' => 'Administrador eliminado correctamente',
                'id'      => $id
            ]);
        }

        return $this->fail([
            'error' => 'No se pudo eliminar el administrador'
        ], 500);
    }


    //===========================================
    // FUNCION PARA BUSCAR ADMINISTRADORES POR DNI
    //===========================================
    public function searchAdminByDNI($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['success' => false, 'error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$dni) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'DNI no proporcionado'])
                ->setStatusCode(400);
        }

        $admin = $this->adminModel->getByDNI($dni);

        if (!$admin) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'Administrador no encontrado'])
                ->setStatusCode(404);
        }

        unset($admin['id'], $admin['password']);

        return $this->response->setJSON([
            'success' => true,
            'data' => $admin
        ]) ->setStatusCode(200);
    }

    //===========================================
    // FUNCION PARA BUSCAR ADMINISTRADORES POR ID
    //===========================================
    public function searchAdminById($id)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['success' => false, 'error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$id) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'ID no proporcionado'])
                ->setStatusCode(400);
        }

        $admin = $this->adminModel->find($id);

        if (!$admin) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'Administrador no encontrado'])
                ->setStatusCode(404);
        }

        unset($admin['id'], $admin['password']);

        return $this->response->setJSON([
            'success' => true,
            'data' => $admin
        ]) ->setStatusCode(200);
    }

    //===========================================
    // FUNCION PARA LISTAR EL HISTORIAL DE ADMINS
    //===========================================
    public function listarHistorial()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para ver el historial'], 403);
        }

        $perPage = 10;
        $historial = $this->historialModel->getHistorialConDetalles($perPage);

        
        $pager = $this->historialModel->pager;
        $currentPage = $pager->getCurrentPage();
        $totalPages = $pager->getPageCount();

        return $this->respond([
            'success' => true,
            'data'    => $historial,
            'pager'   => [
                'currentPage' => $currentPage,
                'totalPages'  => $totalPages,
                'perPage'     => $pager->getPerPage(),
                'total'       => $pager->getTotal()
            ],
            'links'   => [
                'actual'    => current_url() . '?page=' . $currentPage,
                'siguiente' => ($currentPage < $totalPages) ? current_url() . '?page=' . ($currentPage + 1) : null,
                'anterior'  => ($currentPage > 1) ? current_url() . '?page=' . ($currentPage - 1) : null
            ]
        ], 200);
    }
}
