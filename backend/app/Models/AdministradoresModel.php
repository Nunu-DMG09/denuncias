<?php

namespace App\Models;

use CodeIgniter\Model;

class AdministradoresModel extends Model
{
    protected $table = 'adminitradores';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'nombres',
        'password',
        'categoria',
        'estado'
    ];
    protected $useTimestamps = false;
}
