<?php

namespace App\Models;

use CodeIgniter\Model;

class DenunciasModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'denuncias';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'tracking_code',
        'es_animo',
        'denunciante_id',
        'motivo_id',
        'descripcion',
        'denunciado_id',
        'fecha_registro',
        'estado',
        'pdf_path'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'fecha_registro';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      =
    [
        'id' =>[
            'label' => 'id',
            'rules' => 'required'
        ],
        'tracking_code' =>[
            'label' => 'tracking_code',
            'rules' => 'required'
        ],
        'es_animo' =>[
            'label' => 'es_animo',
            'rules' => 'required'
        ],
        'denunciante_id' =>[
            'label' => 'denunciante_id',
            'rules' => 'required'
        ],
        'motivo_id' =>[
            'label' => 'motivo_id',
            'rules' => 'required'
        ],
        'descripcion' =>[
            'label' => 'descripcion',
            'rules' => 'required'
        ],
        'denunciado_id' =>[
            'label' => 'denunciado_id',
            'rules' => 'required'
        ],
        'fecha_registro' =>[
            'label' => 'fecha_registro',
            'rules' => 'required'
        ],
        'estado' =>[
            'label' => 'estado',
            'rules' => 'required'
        ],
        'pdf_path' =>[
            'label' => 'pdf_path',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'id' =>[
            'required' => 'El campo {field} es obligatorio',
        ],
        'tracking_code' =>[
            'required' => 'El campo {field} es obligatorio',
        ],
        'es_animo' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'denunciante_id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'motivo_id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'descripcion' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'denunciado_id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'fecha_registro' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'estado' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'pdf_path' =>[
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
