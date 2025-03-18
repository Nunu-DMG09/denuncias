<?php

namespace App\Models;

use CodeIgniter\Model;

class AdministradoresModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'adminitradores';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'nombres',
        'password',
        'categoria',
        'estado'
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
        'id' =>[
            'label' => 'id',
            'rules' => 'required'
        ],
        'nombres' =>[
            'label' => 'nombres',
            'rules' => 'required'
        ],
        'password' =>[
            'label' => 'password',
            'rules' => 'required'
        ],
        'categoria' =>[
            'label' => 'categoria',
            'rules' => 'required'
        ],
        'estado' =>[
            'label' => 'estado',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'id' =>[
            'required' => 'El campo id es obligatorio'
        ],
        'nombres' =>[
            'required' => 'El campo nombres es obligatorio'
        ],
        'password' =>[
            'required' => 'El campo password es obligatorio'
        ],
        'categoria' =>[
            'required' => 'El campo categoria es obligatorio'
        ],
        'estado' =>[
            'required' => 'El campo estado es obligatorio'
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
