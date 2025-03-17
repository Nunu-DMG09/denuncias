<?php

namespace App\Models;

use CodeIgniter\Model;

class AdjuntosModel extends Model
{
    protected $table = 'adjuntos';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['id', 'nombre', 'ruta', 'tipo', 'id_usuario', 'id_publicacion', 'created_at', 'updated_at'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';

}