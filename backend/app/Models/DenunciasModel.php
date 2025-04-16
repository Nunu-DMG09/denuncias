<?php

namespace App\Models;

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
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'fecha_registro';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      =[];
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
}
