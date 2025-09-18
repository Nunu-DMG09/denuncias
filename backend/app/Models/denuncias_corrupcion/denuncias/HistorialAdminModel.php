<?php

namespace App\Models\denuncias_corrupcion\Denuncias;

use CodeIgniter\Model;

class HistorialAdminModel extends Model
{
    protected $table            = 'historial_admin';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $allowedFields    = [
        'administrador_id',
        'afectado_id',
        'accion',
        'motivo'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'administrador_id' => 'required|integer',
        'afectado_id'      => 'required|integer',
        'accion'           => 'required|string|max_length[50]',
        'motivo'           => 'required|string|max_length[255]'
    ];
    protected $validationMessages = [
        'administrador_id' => [
            'required' => 'El ID del administrador que realiza la acción es obligatorio',
            'integer'  => 'El ID del administrador debe ser un número entero'
        ],
        'afectado_id' => [
            'required' => 'El ID del usuario afectado es obligatorio',
            'integer'  => 'El ID del usuario afectado debe ser un número entero'
        ],
        'accion' => [
            'required'   => 'La acción es obligatoria',
            'max_length' => 'La acción no puede exceder los 50 caracteres'
        ],
        'motivo' => [
            'required'   => 'El motivo es obligatorio',
            'max_length' => 'El motivo no puede exceder los 255 caracteres'
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
