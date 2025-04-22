<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class MotivosModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'motivos';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'nombre',
        'descripcion'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = 
    [
        'nombre' =>[
            'label' => 'nombre',
            'rules' => 'required'
        ],
        'descripcion' =>[
            'label' => 'descripcion',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'nombre' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'descripcion' =>[
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
