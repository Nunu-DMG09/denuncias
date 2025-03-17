<?php

namespace App\Models;

use CodeIgniter\Model;

class MotivosModel extends Model
{
    protected $table = 'motivos';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'nombre',
        'descripcion'
    ];
    protected $useTimestamps = false;
}
