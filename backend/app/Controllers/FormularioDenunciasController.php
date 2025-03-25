<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdjuntosModel;
use App\Models\DenunciadosModel;
use App\Models\DenunciasModel;
use App\Models\DenunciantesModel;
use App\Models\MotivosModel;
use App\Models\SeguimientoDenunciasModel;
use Mpdf\Mpdf;

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
    public function correo($correo, $code)
    {
        $email = \Config\Services::email();
        $email->setFrom('futboleraoficialsenati@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
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
                <p><a href='http://localhost:5173/seguimiento/$code'>Seguimiento</a></p>
                <p>Atentamente,</p>
                <p><strong>Municipalidad Distrital de José Leonardo Ortiz</strong></p>
            </body>
            </html>
        ");

        return $email->send();
    }
    public function pdf($code)
    {
        $formData = $this->request->getJSON(true);
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $motivo = $this->motivosModel
            ->where('id', $denuncia['motivo_id'])
            ->get()
            ->getRow()
            ->descripcion;
        $fileName = 'denuncia_' . $code . '.pdf';
        $filePath = FCPATH . 'uploads/' . $fileName;
        $motivoDescripcion = $denuncia['motivo_id'] === 'mo_otros' ? 'Otros: ' . $denuncia['motivo_otro'] : $motivo;
        $htmlContent = "
            <div style='font-family: Arial, sans-serif;'>
            <div style='display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding-bottom: 12px;'>
            <div style='text-align: center; flex-grow: 2;'>
            <h1 style='margin: 0; font-size: 16px; margin-top: -20px;'>SISTEMA DE DENUNCIAS DE CORRUPCIÓN</h1>
            <h1 style='margin: 0; font-size: 16px; margin-top: -2px;'>MUNICIPALIDAD DISTRITAL DE JOSÉ LEONARDO ORTIZ</h1>
            </div>
            <div style='text-align: right; margin: 25px;'>
            <p style='margin: 0; font-size: 12px;'>Fecha de emisión: " . date('Y-m-d') . "</p>
            </div>
            </div>
            <div style='margin-top: 20px; text-align: left;'>
            <h3 style='font-size: 14px;'>CÓDIGO DE SEGUIMIENTO: <span style='color: #2E8ACB;'>$code</span></h3>
            </div>
            <div style='margin-top: 20px;'>
            <h3 style='font-size: 14px;'>INFORMACIÓN DE LA DENUNCIA</h3>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #ffffff;'>
            <td style='padding: 8px; font-size: 12px;'>Campo</td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Fecha del incidente:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denuncia['fecha_incidente']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'>Tipo de denuncia:</td>
            <td style='padding: 8px; font-size: 12px;'>" . ($denuncia['es_anonimo'] ? "Anónima" : "Con datos personales") . "</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Motivo de la denuncia:</td>
            <td style='padding: 8px; font-size: 12px;'>$motivoDescripcion</td>
            </tr>
            </table>
            </div>";

        if (!$denuncia['es_anonimo']) {
            $htmlContent .= "
            <div style='margin-top: 20px;'>
            <h3 style='font-size: 14px;'>DATOS DEL DENUNCIANTE</h3>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #fff;'>
            <td style='padding: 8px; font-size: 12px;'>Campo</td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color: #f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Nombre:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['nombres']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'>Email:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['email']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Teléfono:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['telefono']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'>Tipo de documento:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['tipo_documento']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Número de documento:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['numero_documento']}</td>
            </tr>
            </table>
            </div>";
        }

        $htmlContent .= "
            <div style='margin-top: 20px;'>
            <h3 style='font-size: 14px;'>DESCRIPCIÓN DE LOS HECHOS</h3>
            <p style='font-size: 12px;'>{$denuncia['descripcion']}</p>
            </div>
            <div style='margin-top: 20px;'>
            <h3 style='font-size: 14px;'>DATOS DEL DENUNCIADO</h3>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #fff;'>
            <td style='padding: 8px; font-size: 12px;'>Campo</td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Tipo de documento:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciado['tipo_documento']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'>Número de documento:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciado['numero_documento']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'>Nombre / Razón Social:</td>
            <td style='padding: 8px; font-size: 12px;'>" . ($denunciado['nombre'] ?? $denunciado['razon_social'] ?? "No disponible") . "</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'>Cargo:</td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciado['cargo']}</td>
            </tr>
            </table>
            </div>
            <div style='margin-top: 20px; text-align: center; font-size: 12px;'>
            <p>Este documento es una constancia de la denuncia presentada y no constituye una admisión o validación de los hechos denunciados.</p>
            </div>
            </div>
        ";

        try {
            $mpdf = new Mpdf();
            $mpdf->WriteHTML($htmlContent);
            $mpdf->Output($filePath, \Mpdf\Output\Destination::FILE);
            return $filePath;
        } catch (\Exception $e) {
            return null;
        }
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
        //Generar PDF
        $pdfPath = $this->pdf($code);
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
                'pdf_path' => $pdfPath
            ])) {
            }
        }
        // Guardar archivo 
        $files = $this->request->getFiles();
        $uploadPath= FCPATH . 'uploads/'. $id_denuncia;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }
        // Insert adjuntos
        foreach ($files as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move($uploadPath, $newName);
                $this->adjuntosModel->insert([
                    'id' => $this->generateId('adjuntos'),
                    'denuncia_id' => $id_denuncia,
                    'file_path' => 'uploads/' . $id_denuncia . '/' . $newName,
                    'file_name' => $file->getClientName(),
                    'file_type' => $file->getMimeType(),
                ]);
            }
        }
        // Insert seguimiento
        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id_seguimiento,
            'denuncia_id' => $id_denuncia,
            'estado' => 'registrado',
            'comentario' => 'Denuncia registrada',
            'fecha_actualizacion' => date('Y-m-d H:i:s')
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
