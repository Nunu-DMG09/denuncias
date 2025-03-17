<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciantesModel extends Model
{
    protected $table = 'denunciantes';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'nombres',
        'email',
        'telefono',
        'numero_documento',
        'tipo_documento',
        'sexo'
    ];
    protected $useTimestamps = false;
}
