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
    function index()
    {
        $data = $this->motivosModel->findAll();
        return $this->response->setJSON($data);
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
                <p 
                    style=
                    'font-size: 18px; 
                    font-weight: bold; 
                    color: #2E8ACB; 
                    padding:15px; 
                    background-color: #CDDFEC';>$code</p>
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
    function create()
    {
        //Obtener datos del formulario
        $dataJson = $this->request->getPost('data');
        $formData = json_decode($dataJson, true);
        //Extraer datos del Json
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];
        //Generar id y tracking code
        $code = $this->generateTrackingCode();
        $id_denunciante = $denuncia['es_anonimo'] ? null : $this->generateId('denunciantes');
        $id_denunciado = $this->generateId('denunciados');
        $id_denuncia = $this->generateId('denuncias');
        $id_seguimiento = $this->generateId('seguimientoDenuncias');
        //Mandar correo con el código de seguimiento
        if (!$denuncia['es_anonimo']) {
            $this->correo($denunciante['email'], $code);
        }
        // Insert denunciante
        if ($denunciante) {
            if ($this->denunciantesModel->insert([
                'id' => $id_denunciante,
                'nombres' => $denunciante['nombres'],
                'email' => $denunciante['email'],
                'telefono' => $denunciante['telefono'],
                'numero_documento' => $denunciante['numero_documento'],
                'tipo_documento' => $denunciante['tipo_documento'],
                'sexo' => $denunciante['sexo']
            ])) {
            }
        }
        // Insert denunciado
        if ($denunciado) {
            if ($this->denunciadosModel->insert([
                'id' => $id_denunciado,
                'nombre' => $denunciado['nombre'],
                'numero_documento' => $denunciado['numero_documento'],
                'tipo_documento' => $denunciado['tipo_documento'],
                'representante_legal' => $denunciado['representante_legal'],
                'razon_social' => $denunciado['razon_social'],
                'cargo' => $denunciado['cargo']
            ])) {
            }
        }
        // Insert denuncia
        if ($denuncia) {
            if ($this->denunciasModel->insert([
                'id' => $id_denuncia,
                'tracking_code' => $code,
                'es_anonimo' => $denuncia['es_anonimo'],
                'denunciante_id' => $id_denunciante,
                'motivo_id' => $denuncia['motivo_id'],
                'motivo_otro' => $denuncia['motivo_otro'],
                'descripcion' => $denuncia['descripcion'],
                'fecha_incidente' => $denuncia['fecha_incidente'],
                'denunciado_id' => $id_denunciado,
                'estado' => 'registrado',
                'pdf_path' => null
            ])) {
            }
        }
        // Guardar archivo 
        $files = $this->request->getFiles();
        $uploadPath = FCPATH . 'uploads/' . $id_denuncia;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }
        // Insert adjuntos
        foreach ($files as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move($uploadPath, $newName);
                $fileType = $file->getClientMimeType();
                $this->adjuntosModel->insert([
                    'id' => $this->generateId('adjuntos'),
                    'denuncia_id' => $id_denuncia,
                    'file_path' => 'uploads/' . $id_denuncia . '/' . $newName,
                    'file_name' => $file->getClientName(),
                    'file_type' => $fileType,
                ]);
            }
        }
        // Insert seguimiento
        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id_seguimiento,
            'denuncia_id' => $id_denuncia,
            'estado' => 'registrado',
            'comentario' => 'Denuncia registrada',
            'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-5 hours'))
        ])) {
        }
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Denuncia registrada correctamente',
            'tracking_code' => $code,
        ]);
    }
    function query($code)
    {
        //Buscar id de la denuncia
        $denuncia = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();
        if (!$denuncia) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontró la denuncia con el código proporcionado.'
            ]);
        }
        //Buscar seguimientos
        $seguimientos = $this->seguimientoDenunciasModel
            ->where('denuncia_id', $denuncia['id'])
            ->orderBy('fecha_actualizacion', 'DESC')
            ->findAll();
        return $this->response->setJSON([
            'success' => true,
            'data' => $seguimientos
        ]);
    }
}
