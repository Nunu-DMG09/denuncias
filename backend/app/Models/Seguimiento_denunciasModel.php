<?php

namespace App\Models;

use CodeIgniter\Model;

class Seguimiento_denunciasModel extends Model
{
    protected $table = 'seguimiento_denuncias';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'estado',
        'comentario',
        'fecha_actualizacion'
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'fecha_creacion';
}
