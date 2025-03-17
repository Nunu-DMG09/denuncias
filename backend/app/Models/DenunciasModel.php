<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciasModel extends Model
{
    protected $table = 'denuncias';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'tracking_code',
        'es_animo',
        'denunciante_id',
        'motivo_id',
        'descripcion',
        'denunciado_id',
        'fecha_registro',
        'estado',
        'pdf_path'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'fecha_registro';
}
