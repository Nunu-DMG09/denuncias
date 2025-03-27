<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DenunciadosModel;
use App\Models\DenunciantesModel;
use App\Models\DenunciasModel;
use App\Models\SeguimientoDenunciasModel;
use App\Models\MotivosModel;
use App\Models\AdjuntosModel;

class GestionController extends BaseController
{
    private $denunciadosModel;
    private $denunciantesModel;
    private $denunciasModel;
    private $seguimientoDenunciasModel;
    private $motivosModel;
    private $adjuntosModel;
    public function __construct()
    {
        $this->denunciadosModel = new DenunciadosModel();
        $this->denunciantesModel = new DenunciantesModel();
        $this->denunciasModel = new DenunciasModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
        $this->motivosModel = new MotivosModel();
        $this->adjuntosModel = new AdjuntosModel();
    }
    public function dashboard()
    {
        $db = \Config\Database::connect();
        $denuncias = $db->table('denuncias')
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
            ->where('denuncias.dni_admin', null)
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->where('denuncias.estado', ['registrado'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
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
    public function receiveAdmin()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $dni_admin = $data['dni_admin'];
        $id = $this->generateId('seguimientoDenuncias');

        $id_denuncias = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();

        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id,
            'denuncia_id' => $id_denuncias['id'],
            'estado' => 'recibida',
            'comentario' => 'La denuncia ha sido recibida por el administrador',
            'fecha_actualizacion' => date('Y-m-d H:i:s'),
            'dni_admin' => $dni_admin
        ])) {
            $update = $this->denunciasModel
                ->where('tracking_code', $code)
                ->set([
                    'dni_admin' => $dni_admin,
                    'estado' => 'recibida'
                ])
                ->update();
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }
        if ($update) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'La denuncia recibida'
            ]);
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Erorr al recibir la denuncia'
            ]);
        }
    }
    public function receivedAdmin()
    {
        $data = $this->request->getGet();
        $dni_admin = $data['dni_admin'];
        $db = \Config\Database::connect();
        $denuncias = $db->table('denuncias')
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
            ->where('denuncias.dni_admin', $dni_admin)
            ->whereIn('denuncias.estado', ['en proceso', 'recibida'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
    }
}
