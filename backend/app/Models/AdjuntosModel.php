<?php

namespace App\Models;

use CodeIgniter\Model;

class AdjuntosModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'adjuntos';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'file_path',
        'file_name',
        'file_type',
        'fecha_subida'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'fecha_subida';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = 
    [
        'denuncia_id' =>[
            'label' => 'denuncia_id',
            'rules' => 'required'
        ],
        'file_path' =>[
            'label' => 'file_path',
            'rules' => 'required'
        ],
        'file_name' =>[
            'label' => 'file_name',
            'rules' => 'required'
        ],
        'file_type' =>[
            'label' => 'file_type',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'denuncia_id' =>[
            'required' => 'El campo {field} es obligatorio',
        ],
        'file_path' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'file_name' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'file_type' =>[
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
