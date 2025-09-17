<?php

namespace App\Models\denuncias_corrupcion\Denuncias;

use CodeIgniter\Model;

class AdjuntosModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'adjunto';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'file_path',
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'denuncia_id' => 'required|integer',
        'file_path'   => 'required|string|max_length[255]',
    ];
    protected $validationMessages = [
        'denuncia_id' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'file_path' => [
            'required'   => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
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

    public function insertAdjunto(array $data)
    {
        return $this->insert($data, true);
    }
    public function getByDenunciaId(int $denunciaId)
    {
        return $this->where('denuncia_id', $denunciaId)->findAll();
    }
}
