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
        $fileName = 'denuncia_' . uniqid() . '.pdf';
        $filePath = FCPATH . 'uploads/' . $fileName;

        $htmlContent = "
            <div style='font-family: Arial, sans-serif;'>
            <div style='display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding-bottom: 12px;'>
            <div style='display: flex; align-items: center; justify-content: space-between;'>
            <div style='display: flex; align-items: center; flex-grow: 1; margin-top: -30px;'>
                <img src='" . base_url('/img/logo.jpeg') . "' alt='Logo' style='width: 50px; margin-right: 12px;' />
            </div>
            <div style='text-align: center; flex-grow: 2;'>
                <h1 style='margin: 0; font-size: 24px; margin-top: -20px;'>SISTEMA DE DENUNCIAS DE CORRUPCIÓN</h1>
                <h2 style='margin: 0; font-size: 22px; margin-top: -12px;'>MUNICIPALIDAD DISTRITAL DE JOSÉ LEONARDO ORTIZ</h2>
            </div>
            </div>
            <div style='text-align: right; margin: 25px;'>
            <p style='margin: 0; font-size: 12px;'><strong>Fecha de emisión:</strong> " . date('Y-m-d') . "</p>
            </div>
            </div>
            <div style='margin-top: 20px; text-align: left;'>
            <h3 style='color: #000000; font-size: 20px;'>CÓDIGO DE SEGUIMIENTO: <span style='color: #2E8ACB;'>$code</span></h3>
            </div>
            <div style='margin-top: 20px;'>
            <h4 style='font-size: 18px;'>INFORMACIÓN DE LA DENUNCIA</h4>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #ffffff;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Campo</strong></td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Fecha del incidente:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denuncia['fecha_incidente']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'><strong>Tipo de denuncia:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>" . ($denuncia['es_anonimo'] ? "Anónima" : "Con datos personales") . "</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Motivo de la denuncia:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>$motivo</td>
            </tr>
            </table>
            </div>";

        if (!$denuncia['es_anonimo']) {
            $htmlContent .= "
            <div style='margin-top: 20px;'>
            <h4 style='font-size: 18px;'>DATOS DEL DENUNCIANTE</h4>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #fff;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Campo</strong></td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color: #f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Nombre:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['nombres']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'><strong>Email:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['email']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Teléfono:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['telefono']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'><strong>Tipo de documento:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['tipo_documento']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Número de documento:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciante['numero_documento']}</td>
            </tr>
            </table>
            </div>";
        }

        $htmlContent .= "
            <div style='margin-top: 20px;'>
            <h4 style='font-size: 18px;'>DESCRIPCIÓN DE LOS HECHOS</h4>
            <p style='font-size: 12px;'>{$denuncia['descripcion']}</p>
            </div>
            <div style='margin-top: 20px;'>
            <h4 style='font-size: 12px;'>DATOS DEL DENUNCIADO</h4>
            <table style='width: 100%; border-collapse: collapse;'>
            <tr style='background-color: #2E8ACB; color: #fff;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Campo</strong></td>
            <td style='padding: 8px; font-size: 12px;'>Detalle</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Tipo de documento:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciado['tipo_documento']}</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'><strong>Número de documento:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>{$denunciado['numero_documento']}</td>
            </tr>
            <tr style='background-color:#f4f5f4;'>
            <td style='padding: 8px; font-size: 12px;'><strong>Nombre / Razón Social:</strong></td>
            <td style='padding: 8px; font-size: 12px;'>" . ($denunciado['nombre'] ?? $denunciado['razon_social'] ?? "No disponible") . "</td>
            </tr>
            <tr>
            <td style='padding: 8px; font-size: 12px;'><strong>Cargo:</strong></td>
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
        $formData = $this->request->getJSON(true);
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];
        $code = $this->generateTrackingCode();
        $pdfPath = $this->pdf($code);
        $id_denunciante = $denuncia['es_anonimo'] ? null : $this->generateId('denunciantes');
        $id_denunciado = $this->generateId('denunciados');
        $id_denuncia = $this->generateId('denuncias');
        $id_seguimiento = $this->generateId('seguimientoDenuncias');
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
        // Insert adjuntos
        if ($adjuntos) {
            foreach ($adjuntos as $adjunto) {
                $id_adjunto = $this->generateId('adjuntos');
                if ($this->adjuntosModel->insert([
                    'id' => $id_adjunto,
                    'denuncia_id' => $id_denuncia,
                    'file_path' => $adjunto['file_name'],
                    'file_name' => $adjunto['file_name'],
                    'file_type' => $adjunto['file_type']
                ])) {
                }
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
    function query()
    {
        $dataquery = $this->request->getJSON(true);
        $tracking_code = $dataquery['tracking_code'];
        $denuncia = $this->denunciasModel
            ->where('tracking_code', $tracking_code)
            ->select('estado, comentario, fecha_actualizacion')
            ->orderBy('fecha_actualizacion', 'DESC')
            ->first();
        return $this->response->setJSON($denuncia);
    }
}
