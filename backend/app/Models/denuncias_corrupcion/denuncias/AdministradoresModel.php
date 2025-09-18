<?php

namespace App\Models\denuncias_corrupcion\Denuncias;

use CodeIgniter\Model;

class AdministradoresModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'administrador';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'dni',
        'nombre',
        'password',
        'rol',
        'estado',
        'area'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'dni'      => 'required|numeric|min_length[8]|max_length[20]',
        'nombre'   => 'permit_empty|string|max_length[100]',
        'password' => 'required|string|min_length[8]|max_length[255]',
        'rol'      => 'required|string|max_length[50]',
        'estado'   => 'required|in_list[1,0]',
        'area'     => 'permit_empty|string|max_length[100]'
    ];
    protected $validationMessages = [
        'dni' => [
            'required'   => 'El campo DNI es obligatorio.',
            'numeric'    => 'El campo DNI debe contener solo números.',
            'min_length' => 'El campo DNI debe tener al menos {param} dígitos.',
            'max_length' => 'El campo DNI no puede exceder {param} dígitos.'
        ],
        'nombre' => [
            'required'   => 'El campo nombre es obligatorio.',
            'max_length' => 'El campo nombre no puede exceder {param} caracteres.'
        ],
        'password' => [
            'required'   => 'La contraseña es obligatoria.',
            'min_length' => 'La contraseña debe tener al menos {param} caracteres.',
            'max_length' => 'La contraseña no puede exceder {param} caracteres.'
        ],
        'rol' => [
            'required'   => 'El rol es obligatorio.',
            'max_length' => 'El rol no puede exceder {param} caracteres.'
        ],
        'estado' => [
            'required' => 'El estado es obligatorio.',
            'in_list'  => 'El estado debe ser "1" o "0"'
        ],
        'area' => [
            'max_length' => 'El área no puede exceder {param} caracteres.'
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
