<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdjuntosModel;
use App\Models\DenunciadosModel;
use App\Models\DenunciasModel;
use App\Models\DenunciantesModel;
use App\Models\MotivosModel;
use App\Models\SeguimientoDenunciasModel;

class FormularioDenunciasController extends ResourceController
{
    private $adjuntosModel;
    private $denunciadosModel;
    private $denunciasModel;
    private $denunciantesModel;
    private $motivosModel;
    private $seguimientoDenunciasModel;
    function __construct()
    {
        $this->adjuntosModel = new AdjuntosModel();
        $this->denunciadosModel = new DenunciadosModel();
        $this->denunciasModel = new DenunciasModel();
        $this->denunciantesModel = new DenunciantesModel();
        $this->motivosModel = new MotivosModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
    }
    public function generateId($table)
    {
        $prefixes = [
            'denuncias' => 'de',
            'denunciantes' => 'dn',
            'denunciados' => 'de',
            'adjuntos' => 'ad',
            'seguimientoDenuncias' => 'sd'
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
    public function generateTrackingCode()
    {
        do {
            $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(9)));
        } while ($this->denunciasModel->where('tracking_code', $trackingCode)->first());
        return $trackingCode;
    }
    function index()
    {
        $data = $this->motivosModel->findAll();
        return $this->response->setJSON($data);
    }
    public function options()
    {
        return $this->response->setStatusCode(200);
    }
    function create()
    {
        $formData = $this->request->getJSON(true);
        // log_message('info', 'Formulario de denuncia recibido: ' . json_encode($formData));
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];
        $code = $this->generateTrackingCode();
        $id_denunciado = $this->generateId('denunciados');
        $id_denuncia = $this->generateId('denuncias');
        $id_seguimiento = $this->generateId('seguimientoDenuncias');
        // Insert denunciante
        $db = \Config\Database::connect();
        $db->transBegin();
        try {
            $id_denunciante = null;
            if (!$denuncia['es_anonimo'] && $denunciante) {
                $id_denunciante = $this->generateId('denunciantes');

                if (!$this->denunciantesModel->insert([
                    'id' => $id_denunciante,
                    'nombres' => $denunciante['nombres'],
                    'email' => $denunciante['email'],
                    'telefono' => $denunciante['telefono'],
                    'numero_documento' => $denunciante['numero_documento'],
                    'tipo_documento' => $denunciante['tipo_documento'],
                    'sexo' => $denunciante['sexo']
                ])) {
                    throw new \Exception('Error al registrar denunciante: ' . json_encode($this->denunciantesModel->errors()));
                }
            }
            if (!$this->denunciadosModel->insert([
                'id' => $id_denunciado,
                'nombre' => $denunciado['nombre'],
                'numero_documento' => $denunciado['numero_documento'],
                'tipo_documento' => $denunciado['tipo_documento'],
                'representante_legal' => $denunciado['representante_legal'],
                'razon_social' => $denunciado['razon_social'],
                'cargo' => $denunciado['cargo']
            ])) {
                throw new \Exception('Error al registrar denunciado: ' . json_encode($this->denunciadosModel->errors()));
            }
            if (!$this->denunciasModel->insert([
                'id' => $id_denuncia,
                'tracking_code' => $code,
                'es_anonimo' => $denuncia['es_anonimo'],
                'denunciante_id' => $id_denunciante, // Puede ser null
                'motivo_id' => $denuncia['motivo_id'],
                'motivo_otro' => $denuncia['motivo_otro'],
                'descripcion' => $denuncia['descripcion'],
                'denunciado_id' => $id_denunciado,
                'estado' => 'registrado'
            ])) {
                throw new \Exception('Error al registrar denuncia: ' . json_encode($this->denunciasModel->errors()));
            }
            if ($adjuntos) {
                foreach ($adjuntos as $adjunto) {
                    $id_adjunto = $this->generateId('adjuntos');
                    if (!$this->adjuntosModel->insert([
                        'id' => $id_adjunto,
                        'denuncia_id' => $id_denuncia,
                        'file_path' => $adjunto['file_name'],
                        'file_name' => $adjunto['file_name'],
                        'file_type' => $adjunto['file_type']
                    ])) {
                        throw new \Exception('Error al registrar adjunto: ' . json_encode($this->adjuntosModel->errors()));
                    }
                }
            }
            if (!$this->seguimientoDenunciasModel->insert([
                'id' => $id_seguimiento,
                'denuncia_id' => $id_denuncia,
                'estado' => 'registrado',
                'comentario' => 'Denuncia registrada',
                'fecha_actualizacion' => date('Y-m-d H:i:s'),
                'administrador_dni' => null
            ])) {
                throw new \Exception('Error al registrar seguimiento: ' . json_encode($this->seguimientoDenunciasModel->errors()));
            }
            $db->transCommit();

            // Retorna respuesta exitosa con el código de tracking
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Denuncia registrada correctamente',
                'tracking_code' => $code
            ]);
        } catch (\Exception $e) {
            $db->transRollback();
            log_message('error', 'Error en create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al registrar la denuncia: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
        // if ($denunciante) {
        //     if ($this->denunciantesModel->insert([
        //         'id' => $id_denunciante,
        //         'nombres' => $denunciante['nombres'],
        //         'email' => $denunciante['email'],
        //         'telefono' => $denunciante['telefono'],
        //         'numero_documento' => $denunciante['numero_documento'],
        //         'tipo_documento' => $denunciante['tipo_documento'],
        //         'sexo' => $denunciante['sexo']
        //     ])) {
        //         // log_message('info', 'Denunciante insertado correctamente con ID: ' . $id_denunciante);
        //     } else {
        //         return $this->response->setJSON([
        //             'success' => false,
        //             'message' => 'Error al registrar denunciante'
        //         ]);
        //     }
        //     // Insert denunciado
        //     if ($denunciado) {
        //         if ($this->denunciadosModel->insert([
        //             'id' => $id_denunciado,
        //             'nombre' => $denunciado['nombre'],
        //             'numero_documento' => $denunciado['numero_documento'],
        //             'tipo_documento' => $denunciado['tipo_documento'],
        //             'representante_legal' => $denunciado['representante_legal'],
        //             'razon_social' => $denunciado['razon_social'],
        //             'cargo' => $denunciado['cargo']
        //         ])) {
        //             // log_message('info', 'Denunciado insertado correctamente con ID: ' . $id_denunciado);
        //         } else {
        //             return $this->response->setJSON([
        //                 'success' => false,
        //                 'message' => 'Error al registrar denunciado'
        //             ]);
        //         }
        //     }
        //     // Insert denuncia
        //     if ($denuncia) {
        //         if ($this->denunciasModel->insert([
        //             'id' => $id_denuncia,
        //             'tracking_code' => $code,
        //             'es_anonimo' => $denuncia['es_anonimo'],
        //             'denunciante_id' => $id_denunciante,
        //             'motivo_id' => $denuncia['motivo_id'],
        //             'motivo_otro' => $denuncia['motivo_otro'],
        //             'descripcion' => $denuncia['descripcion'],
        //             'denunciado_id' => $id_denunciado,
        //             'estado' => 'registrado'
        //         ])) {
        //             // log_message('info', 'Denuncia insertada correctamente con ID: ' . $id_denuncia);
        //         } else {
        //             return $this->response->setJSON([
        //                 'success' => false,
        //                 'message' => 'Error al registrar denuncia'
        //             ]);
        //         }
        //     }
        //     if ($adjuntos) {
        //         foreach ($adjuntos as $adjunto) {
        //             $id_adjunto = $this->generateId('adjuntos');
        //             if ($this->adjuntosModel->insert([
        //                 'id' => $id_adjunto,
        //                 'denuncia_id' => $id_denuncia,
        //                 'file_path' => $adjunto['file_name'],
        //                 'file_name' => $adjunto['file_name'],
        //                 'file_type' => $adjunto['file_type']
        //             ])) {
        //                 // log_message('info', 'Adjunto insertado correctamente: ' . $adjunto['file_name']);
        //             } else {
        //                 return $this->response->setJSON([
        //                     'success' => false,
        //                     'message' => 'Error al registrar adjunto'
        //                 ]);
        //             }
        //         }
        //     }
        //     if ($this->seguimientoDenunciasModel->insert([
        //         'id' => $id_seguimiento,
        //         'denuncia_id' => $id_denuncia,
        //         'estado' => 'registrado',
        //         'comentario' => 'Denuncia registrada',
        //         'fecha_actualizacion' => date('Y-m-d H:i:s')
        //     ])) {
        //         // log_message('info', 'Seguimiento de denuncia insertado correctamente');
        //     } else {
        //         log_message('error', 'Error al registrar seguimiento de denuncia' . json_encode($this->seguimientoDenunciasModel->errors()));
        //         return $this->response->setJSON([
        //             'success' => false,
        //             'message' => 'Error al registrar seguimiento de denuncia'
        //         ]);
        //     }
        //     return $this->response->setJSON([
        //         'success' => true,
        //         'message' => 'Denuncia registrada correctamente',
        //         'tracking_code' => $code,
        //     ]);
        // }
    }
}
