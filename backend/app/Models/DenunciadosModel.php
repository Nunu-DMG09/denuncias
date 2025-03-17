<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciadosModel extends Model
{
    protected $table = 'denunciados';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = 
    [
        'id',
        'nombre',
        'numero_documento',
        'tipo_documento',
        'representante_legal',
        'razon_social',
        'cargo'
    ];
    protected $useTimestamps = false;
}
