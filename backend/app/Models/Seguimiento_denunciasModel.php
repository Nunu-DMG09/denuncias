<?php

namespace App\Models;

use CodeIgniter\Model;

class Seguimiento_denunciasModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'seguimiento_denuncias';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'estado',
        'comentario',
        'fecha_actualizacion'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'fecha_actualizacion';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = 
    [
        'denuncia_id' =>[
            'label' => 'denuncia_id',
            'rules' => 'required'
        ],
        'estado' =>[
            'label' => 'estado',
            'rules' => 'required'
        ],
        'comentario' =>[
            'label' => 'comentario',
            'rules' => 'required'
        ],
        'fecha_actualizacion' =>[
            'label' => 'fecha_actualizacion',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'denuncia_id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'estado' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'comentario' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'fecha_actualizacion' =>[
            'required' => 'El campo {field} es obligatorio'
        ]
    ];
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
