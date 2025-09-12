<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;
use App\Services\MailService;

class DenunciasModel extends Model
{
    protected $table            = 'denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $allowedFields =
    [
        'id',
        'tracking_code',
        'es_anonimo',
        'denunciante_id',
        'denunciado_id',
        'estado',
        'fecha_incidente',
        'descripcion',
        'lugar',
        'motivo_id',
        'motivo_otro',
        'area'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'tracking_code'   => 'required|string|max_length[20]',
        'es_anonimo'      => 'required|in_list[0,1]',
        'denunciante_id'  => 'permit_empty|integer',
        'descripcion'     => 'permit_empty|string',
        'fecha_incidente' => 'permit_empty|valid_date',
        'denunciado_id' => 'permit_empty|is_natural_no_zero',
        'estado'          => 'required|string|max_length[20]',
        'lugar'           => 'permit_empty|string|max_length[50]',
        'area'            => 'permit_empty|string|max_length[50]',
        'motivo_id'       => 'permit_empty|is_natural_no_zero',
        'motivo_otro'     => 'permit_empty|string|max_length[255]',
    ];
    protected $validationMessages = [
        'tracking_code' => [
            'required' => 'El código de seguimiento es obligatorio.',
            'max_length' => 'El código de seguimiento no puede exceder los 50 caracteres.'
        ],
        'es_anonimo' => [
            'required' => 'Debe indicar si la denuncia es anónima.',
            'in_list'  => 'El valor de anonimato debe ser 0 o 1.'
        ],
        'descripcion' => [
            'required' => 'La descripción de la denuncia es obligatoria.'
        ],
        'fecha_incidente' => [
            'required'    => 'La fecha del incidente es obligatoria.',
            'valid_date'  => 'Debe proporcionar una fecha de incidente válida.'
        ],
        'denunciado_id' => [
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'denunciante_id' => [
            'required' => 'Debe especificar la persona denunciante.',
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'lugar' => [
            'max_length' => 'El campo lugar no puede exceder los 50 caracteres.'
        ],
        'area' => [
            'max_length' => 'El campo área no puede exceder los 50 caracteres.'
        ],
        'motivo_id' => [
            'integer' => 'El ID del motivo debe ser un número entero.'
        ],
        'motivo_otro' => [
            'max_length' => 'El campo motivo (otro) no puede exceder los 255 caracteres.'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Dependencias externas (otros modelos)
    protected $denunciantesModel;
    protected $denunciadosModel;
    protected $adjuntosModel;
    private $emailService;
    // protected $seguimientoDenunciasModel; // si luego lo habilitas

    public function __construct()
    {
        parent::__construct();

        $this->denunciantesModel = new \App\Models\Denuncias\DenunciantesModel();
        $this->denunciadosModel  = new \App\Models\Denuncias\DenunciadosModel();
        $this->adjuntosModel     = new \App\Models\Denuncias\AdjuntosModel();
        $this->emailService     = new MailService();
        // $this->seguimientoDenunciasModel = new \App\Models\Denuncias\SeguimientoDenunciasModel();
    }

    public function obtenerPorTracking(string $trackingCode)
    {
        return $this->where('tracking_code', $trackingCode)->first();
    }

    public function generateTrackingCode()
    {
        do {
            $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(4)));
        } while ($this->obtenerPorTracking($trackingCode));
        return $trackingCode;
    }


    public function createDenuncia(array $data, array $files)
    {
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            // Decodificar JSON de la denuncia, denunciado y denunciante
            $denunciaData     = json_decode($data["denuncia"] ?? '{}', true);
            $denunciadoData   = json_decode($data["denunciado"] ?? '{}', true);
            $denuncianteRaw   = $data["denunciante"] ?? null;
            $denuncianteData  = !empty($denuncianteRaw) ? json_decode($denuncianteRaw, true) : null;

            // =====================
            // PROCESAR DENUNCIADO
            // =====================
            $denunciadoID = null;
            if (!empty($denunciadoData) && !empty($denunciadoData['documento'])) {
                $denunciado = $this->denunciadoModel->getByDocument($denunciadoData['documento']);
                if ($denunciado) {
                    $denunciadoID = $denunciado['id'];
                } else {
                    $this->denunciadoModel->insert([
                        'nombre'             => $denunciadoData['nombre'] ?? null,
                        'razon_social'       => $denunciadoData['razon_social'] ?? null,
                        'representante_legal'=> $denunciadoData['representante_legal'] ?? null,
                        'tipo_documento'     => $denunciadoData['tipo_documento'] ?? null,
                        'documento'          => $denunciadoData['documento'] ?? null,
                        'direccion'          => $denunciadoData['direccion'] ?? null,
                        'telefono'           => $denunciadoData['celular'] ?? null,
                    ]);
                    $denunciadoID = $this->denunciadoModel->getInsertID();
                }
            }

            // =====================
            // PROCESAR DENUNCIANTE
            // =====================
            $denuncianteID = null;
            if ((int)($denunciaData['es_anonimo'] ?? 0) === 0 && !empty($denuncianteData)) {
                if (!empty($denuncianteData['documento'])) {
                    $denunciante = $this->denuncianteModel->getByDocument($denuncianteData['documento']);
                    if ($denunciante) {
                        $denuncianteID = $denunciante['id'];
                    } else {
                        $this->denuncianteModel->insert([
                            'nombre'        => $denuncianteData['nombre'] ?? null,
                            'email'         => $denuncianteData['email'] ?? null,
                            'telefono'      => null,
                            'celular'       => $denuncianteData['celular'] ?? null,
                            'documento'     => $denuncianteData['documento'] ?? null,
                            'tipo_documento'=> $denuncianteData['tipo_documento'] ?? null,
                            'razon_social'  => $denuncianteData['razon_social'] ?? null,
                            'sexo'          => $denuncianteData['sexo'] ?? null,
                            'distrito'      => $denuncianteData['distrito'] ?? null,
                            'provincia'     => $denuncianteData['provincia'] ?? null,
                            'departamento'  => $denuncianteData['departamento'] ?? null,
                            'direccion'     => $denuncianteData['direccion'] ?? null,
                        ]);
                        $denuncianteID = $this->denuncianteModel->getInsertID();
                    }
                }
            }

            // =====================
            // CREAR DENUNCIA
            // =====================
            $trackingCode = $this->generateTrackingCode();
            $denunciaID = $this->insert([
                'tracking_code'  => $trackingCode,
                'es_anonimo'     => $denunciaData['es_anonimo'] ?? 0,
                'denunciante_id' => $denuncianteID,
                'denunciado_id'  => $denunciadoID,
                'descripcion'     => !empty($denunciaData['descripcion']) ? $denunciaData['descripcion'] : '',
                'fecha_incidente' => !empty($denunciaData['fecha_incidente']) ? $denunciaData['fecha_incidente'] : null,
                'estado'         => 'registrado',
                'lugar'          => $denunciaData['lugar'] ?? null
            ], true);

            if (!$denunciaID) {
                $db->transRollback();
                log_message('error', '❌ Error de validación al registrar denuncia: ' . json_encode($this->errors()));
                return ['success' => false, 'errors' => $this->errors()];
            }

            // =====================
            // PROCESAR ADJUNTOS
            // =====================
            if (isset($files['adjuntos'])) {
                if (count($files['adjuntos']) > 10) {
                    throw new \Exception('Se permiten un máximo de 10 archivos adjuntos');
                }

                $uploadPath = FCPATH . 'uploads/adjuntos_denuncias/' . $denunciaID . '/';
                if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);

                $allowedTypes = [
                    'image/jpeg','image/png','image/webp','image/avif',
                    'application/pdf','application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain','audio/mpeg','audio/mp3','audio/wav',
                    'audio/ogg','audio/x-m4a','video/mp4','video/x-msvideo',
                    'video/avi','video/mpeg','video/ogg','video/webm',
                    'application/zip','application/x-zip-compressed'
                ];

                foreach ($files['adjuntos'] as $file) {
                    if ($file->isValid() && !$file->hasMoved()) {
                        if ($file->getSize() > 20 * 1024 * 1024) {
                            throw new \Exception("El archivo {$file->getClientName()} excede el límite de 20MB");
                        }
                        if (!in_array($file->getClientMimeType(), $allowedTypes)) {
                            throw new \Exception("Tipo de archivo no permitido: {$file->getClientMimeType()}");
                        }

                        $fileName = $file->getRandomName();
                        $file->move($uploadPath, $fileName);

                        $this->adjuntoModel->insert([
                            'denuncia_id' => $denunciaID,
                            'file_path'   => $uploadPath . '/' . $fileName
                        ]);
                    }
                }
            }

            // =====================
            // ENVIAR EMAIL SI CORRESPONDE
            // =====================
            if (!empty($denuncianteID)) {
                $denunciante = $this->denuncianteModel->find($denuncianteID);
                if ($denunciante && !empty($denunciante['email'])) {
                    $this->emailService->sendTrackingMail($denunciante['email'], $trackingCode);
                }
            }

            $db->transCommit();

            return [
                'success'       => true,
                'message'       => '✅ Denuncia registrada con éxito',
                'tracking_code' => $trackingCode
            ];

        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', '❌ Error al crear denuncia: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
            return [
                'success' => false,
                'message' => 'Error al procesar la denuncia: ' . $e->getMessage(),
                'errors'  => $this->errors()
            ];
        }
    }


    public function correo($correo, $code)
{
    $email = \Config\Services::email();

    $email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
    $email->setTo($correo);
    $email->setSubject('Código de Seguimiento de Denuncia');
    $email->setMessage("
        <html>
        <head>
            <title>Código de Seguimiento de Denuncia</title>
        </head>
        <body style='font-family: Asap, sans-serif;'>
            <p>Estimado usuario,</p>
            <p>Su denuncia ha sido registrada exitosamente. A continuación, le proporcionamos su código de seguimiento:</p>
            <p style='font-size: 18px; font-weight: bold; color: #2E8ACB; padding:15px; background-color: #CDDFEC;'>$code</p>
            <p>Por favor, conserve este código para futuras consultas.</p>
            <p>Para realizar el seguimiento de su denuncia, puede ingresar al siguiente enlace:</p>
            <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Seguimiento</a></p>
            <p>Atentamente,</p>
            <p><strong>Municipalidad Distrital de José Leonardo Ortiz</strong></p>
        </body>
        </html>
    ");

    return $email->send();
}


    public function getDashboardData()
    {
        return $this
            ->select('
                denuncias.tracking_code, 
                denuncias.estado, 
                denuncias.fecha_registro, 
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
                COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
                denunciados.nombre as denunciado_nombre, 
                denunciados.numero_documento as denunciado_dni, 
                motivos.nombre as motivo
            ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->where('denuncias.dni_admin', null)
            ->where('denuncias.estado', 'registrado')
            ->findAll();
    }

    public function receiveDenuncia($trackingCode, $dniAdmin, $estado, $comentario, $seguimientoData)
    {
        $denuncia = $this->where('tracking_code', $trackingCode)->first();

        if (!$denuncia) {
            return false;
        }

        $this->db->transStart();

        // Update denuncia
        $this->where('tracking_code', $trackingCode)
            ->set([
                'dni_admin' => $dniAdmin,
                'estado' => $estado
            ])
            ->update();

        // Use SeguimientoDenunciasModel to insert seguimiento
        $seguimientoModel = new \App\Models\Denuncias\SeguimientoDenunciasModel();
        $seguimientoData['denuncia_id'] = $denuncia['id'];
        $seguimientoModel->insertSeguimiento($seguimientoData);

        $this->db->transComplete();

        return $this->db->transStatus() ? $denuncia : false;
    }

    public function getReceivedAdminData($dniAdmin)
    {
        return $this
            ->select('
                denuncias.tracking_code, 
                denuncias.estado, 
                denuncias.fecha_registro, 
                denuncias.fecha_incidente,
                denuncias.descripcion,
                denuncias.motivo_otro,
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
                COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
                denunciados.nombre as denunciado_nombre, 
                denunciados.numero_documento as denunciado_dni, 
                motivos.nombre as motivo,
                seguimiento_denuncias.estado as seguimiento_estado,
                seguimiento_denuncias.comentario as seguimiento_comentario
            ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->join('seguimiento_denuncias', 'denuncias.id = seguimiento_denuncias.denuncia_id', 'left')
            ->where('denuncias.dni_admin', $dniAdmin)
            ->whereIn('denuncias.estado', ['en proceso', 'recibida'])
            ->groupBy('denuncias.id')
            ->findAll();
    }

    public function searchByDocumento($numeroDocumento)
    {
        return $this
            ->select('
                denuncias.id,
                denuncias.tracking_code,
                denuncias.motivo_id,
                denuncias.descripcion, 
                denuncias.fecha_registro,
                denuncias.estado,
                denuncias.motivo_otro,
                denunciados.nombre as denunciado_nombre,
                denunciados.numero_documento as denunciado_dni,
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre,
                COALESCE(denunciantes.numero_documento, "") as denunciante_dni,
                (
                    SELECT comentario FROM seguimiento_denuncias 
                    WHERE seguimiento_denuncias.denuncia_id = denuncias.id 
                    ORDER BY fecha_actualizacion DESC LIMIT 1
                ) as seguimiento_comentario
            ')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->where('denunciados.numero_documento', $numeroDocumento)
            ->findAll();
    }

    public function getDenunciaByTrackingCode($trackingCode)
    {
        return $this->where('tracking_code', $trackingCode)->first();
    }

    public function insertDenuncia(array $data)
    {
        return $this->insert($data);
    }



//     public function createDenuncia(array $data, array $files)
// {
//     $db = \Config\Database::connect();
//     $db->transBegin();

//     try {
//         $denunciaData = json_decode($data["denuncia"], true);
//         $denunciadoData = json_decode($data["denunciado"], true);
//         $denuncianteRaw = $data["denunciante"];
//         $denuncianteData = !empty($denuncianteRaw) ? json_decode($denuncianteRaw, true) : null;

//         // Inicialización de IDs
//         $denunciadoID = null;
//         $denuncianteID = null;

//         /** ==============================
//          *  1. Registrar o buscar denunciado
//          * ============================== */
//         if (!empty($denunciadoData) && !empty($denunciadoData['documento'])) {
//             $denunciado = $this->denunciadoModel->getByDocument($denunciadoData['documento']);
//             if ($denunciado) {
//                 $denunciadoID = $denunciado['id'];
//             } else {
//                 $this->denunciadoModel->insert([
//                     'nombre'               => $denunciadoData['nombre'] ?? null,
//                     'razon_social'         => $denunciadoData['razon_social'] ?? null,
//                     'representante_legal'  => $denunciadoData['representante_legal'] ?? null,
//                     'tipo_documento'       => $denunciadoData['tipo_documento'] ?? null,
//                     'documento'            => $denunciadoData['documento'] ?? null,
//                     'direccion'            => $denunciadoData['direccion'] ?? null,
//                     'telefono'             => $denunciadoData['celular'] ?? null,
//                 ]);
//                 $denunciadoID = $this->denunciadoModel->getInsertID();
//             }
//         }

//         /** ==============================
//          *  2. Registrar o buscar denunciante (si no es anónimo)
//          * ============================== */
//         if ((int)($denunciaData['es_anonimo'] ?? 0) === 0 && !empty($denuncianteData)) {
//             if (!empty($denuncianteData['documento'])) {
//                 $denunciante = $this->denuncianteModel->getByDocument($denuncianteData['documento']);
//                 if ($denunciante) {
//                     $denuncianteID = $denunciante['id'];
//                 } else {
//                     $this->denuncianteModel->insert([
//                         'nombre'         => $denuncianteData['nombre'] ?? null,
//                         'email'          => $denuncianteData['email'] ?? null,
//                         'telefono'       => null,
//                         'celular'        => $denuncianteData['celular'] ?? null,
//                         'documento'      => $denuncianteData['documento'] ?? null,
//                         'tipo_documento' => $denuncianteData['tipo_documento'] ?? null,
//                         'razon_social'   => $denuncianteData['razon_social'] ?? null,
//                         'sexo'           => $denuncianteData['sexo'] ?? null,
//                         'distrito'       => $denuncianteData['distrito'] ?? null,
//                         'provincia'      => $denuncianteData['provincia'] ?? null,
//                         'departamento'   => $denuncianteData['departamento'] ?? null,
//                         'direccion'      => $denuncianteData['direccion'] ?? null,
//                     ], true);
//                     $denuncianteID = $this->denuncianteModel->getInsertID();
//                 }
//             }
//         }

//         /** ==============================
//          *  3. Validar motivo si existe
//          * ============================== */
//         $motivoID = $denunciaData['motivo_id'] ?? null;
//         if (!empty($motivoID)) {
//             $motivo = $this->motivosModel->find($motivoID);
//             if (!$motivo) {
//                 throw new \Exception('El motivo especificado no existe.');
//             }
//         }

//         /** ==============================
//          *  4. Insertar denuncia
//          * ============================== */
//         $trackingCode = $this->generateTrackingCode();
//         $denunciaID = $this->insert([
//             'tracking_code'   => $trackingCode,
//             'es_anonimo'      => $denunciaData['es_anonimo'] ?? 0,
//             'denunciante_id'  => $denuncianteID,
//             'denunciado_id'   => $denunciadoID,
//             'descripcion'     => $denunciaData['descripcion'] ?? null,
//             'fecha_incidente' => $denunciaData['fecha_incidente'] ?? null,
//             'estado'          => 'registrado',
//             'lugar'           => $denunciaData['lugar'] ?? null,
//             'area'            => $denunciaData['area'] ?? null,
//             'motivo_id'       => $motivoID,
//             'motivo_otro'     => $denunciaData['motivo_otro'] ?? null
//         ], true);

//         if (!$denunciaID) {
//             $db->transRollback();
//             log_message('error', 'Error de validación al registrar denuncia: ' . json_encode($this->errors()));
//             return ['success' => false, 'errors' => $this->errors()];
//         }

//         /** ==============================
//          *  5. Manejo de archivos adjuntos
//          * ============================== */
//         if (isset($files['adjuntos'])) {
//             if (count($files['adjuntos']) > 10) {
//                 throw new \Exception('Se permiten un máximo de 10 archivos adjuntos');
//             }
//             $uploadPath = FCPATH . 'uploads/adjuntos_denuncias/' . $denunciaID . '/';
//             if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);
//             $allowedTypes = [
//                 'image/jpeg', 'image/png', 'image/webp', 'image/avif',
//                 'application/pdf', 'application/msword',
//                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//                 'text/plain', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a',
//                 'video/mp4', 'video/x-msvideo', 'video/avi', 'video/mpeg', 'video/ogg', 'video/webm',
//                 'application/zip', 'application/x-zip-compressed'
//             ];
//             foreach ($files['adjuntos'] as $file) {
//                 if ($file->isValid() && !$file->hasMoved()) {
//                     if ($file->getSize() > 20 * 1024 * 1024)
//                         throw new \Exception("El archivo {$file->getClientName()} excede el límite de 20MB");
//                     if (!in_array($file->getClientMimeType(), $allowedTypes))
//                         throw new \Exception("Tipo de archivo no permitido: {$file->getClientMimeType()}");
//                     $fileName = $file->getRandomName();
//                     $file->move($uploadPath, $fileName);

//                     $this->adjuntoModel->insert([
//                         'denuncia_id' => $denunciaID,
//                         'file_path'   => $uploadPath . '/' . $fileName
//                     ]);
//                 }
//             }
//         }

//         /** ==============================
//          *  6. Enviar correo si corresponde
//          * ============================== */
//         if (!empty($denuncianteID)) {
//             $denunciante = $this->denuncianteModel->find($denuncianteID);
//             if ($denunciante && !empty($denunciante['email'])) {
//                 $this->emailService->sendTrackingMail($denunciante['email'], $trackingCode);
//             }
//         }

//         $db->transCommit();

//         return [
//             'success'       => true,
//             'message'       => 'Denuncia registrada con éxito',
//             'tracking_code' => $trackingCode
//         ];
//     } catch (\Throwable $e) {
//         $db->transRollback();
//         log_message('error', 'Error al crear denuncia: ' . $e->getMessage());
//         return [
//             'success' => false,
//             'message' => 'Error al procesar la denuncia: ' . $e->getMessage(),
//             'errors'  => $this->errors()
//         ];
//     }
// }
}
