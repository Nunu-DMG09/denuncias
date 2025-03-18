<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciantesModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'denunciantes';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
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
        'email' =>[
            'label' => 'email',
            'rules' => 'required'
        ],
        'telefono' =>[
            'label' => 'telefono',
            'rules' => 'required'
        ],
        'numero_documento' =>[
            'label' => 'numero_documento',
            'rules' => 'required'
        ],
        'tipo_documento' =>[
            'label' => 'tipo_documento',
            'rules' => 'required'
        ],
        'sexo' =>[
            'label' => 'sexo',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   =
    [
        'id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'nombres' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'email' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'telefono' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'numero_documento' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'tipo_documento' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'sexo' =>[
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
