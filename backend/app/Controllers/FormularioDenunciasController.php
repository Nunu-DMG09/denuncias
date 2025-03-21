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
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];
        $code = $this->generateTrackingCode();
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
                'estado' => 'registrado'
            ])) {
            }
        }
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
}
