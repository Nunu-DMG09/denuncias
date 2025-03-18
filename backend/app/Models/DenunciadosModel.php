<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciadosModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'denunciados';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
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
        'nombre' =>[
            'label' => 'nombre',
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
        'representante_legal' =>[
            'label' => 'representante_legal',
            'rules' => 'required'
        ],
        'razon_social' =>[
            'label' => 'razon_social',
            'rules' => 'required'
        ],
        'cargo' =>[
            'label' => 'cargo',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'nombre' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'numero_documento' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'tipo_documento' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'representante_legal' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'razon_social' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'cargo' =>[
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
