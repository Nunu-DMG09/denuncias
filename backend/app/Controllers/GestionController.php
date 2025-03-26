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
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->where('denuncias.estado', ['registrado'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
    }
    public function receiveAdmin()
    {
        $data = $this->request->getJSON(true);
        $code = $data['tracking_code'];
        $dni_admin = $data['dni_admin'];
        $update = $this->denunciasModel
            ->where('tracking_code', $code)
            ->set('dni_admin', $dni_admin)
            ->update();
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
        $data = $this->request->getJSON(true);
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
            ->whereNotIn('denuncias.estado', ['rechazado', 'resuelto'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
    }
}
