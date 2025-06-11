<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class DenunciasModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'denuncias';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'tracking_code',
        'es_anonimo',
        'denunciante_id',
        'motivo_id',
        'motivo_otro',
        'descripcion',
        'fecha_incidente',
        'denunciado_id',
        'dni_admin',
        'fecha_registro',
        'estado',
        'pdf_path'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

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
}
