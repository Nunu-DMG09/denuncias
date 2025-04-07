<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DenunciadosModel;
use App\Models\DenunciantesModel;
use App\Models\DenunciasModel;
use App\Models\SeguimientoDenunciasModel;
use App\Models\MotivosModel;
use App\Models\AdjuntosModel;

class GestionController extends BaseController
{
    private $denunciadosModel;
    private $denunciantesModel;
    private $denunciasModel;
    private $seguimientoDenunciasModel;
    private $motivosModel;
    private $adjuntosModel;
    public function __construct()
    {
        $this->denunciadosModel = new DenunciadosModel();
        $this->denunciantesModel = new DenunciantesModel();
        $this->denunciasModel = new DenunciasModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
        $this->motivosModel = new MotivosModel();
        $this->adjuntosModel = new AdjuntosModel();
    }
    public function generateId($table)
    {
        $prefixes = [
            'denuncias' => 'de',
            'denunciantes' => 'dn',
            'denunciados' => 'de',
            'adjuntos' => 'ad',
            'seguimientoDenuncias' => 'sd'
        ];
        if (!isset($prefixes[$table])) {
            throw new \InvalidArgumentException("Invalid table name: $table");
        }
        $model = $this->{$table . 'Model'};
        $prefix = $prefixes[$table];
        do {
            $uuid = $prefix . substr(bin2hex(random_bytes(6)), 0, 6);
        } while ($model->where('id', $uuid)->first());
        return $uuid;
    }
    public function dashboard()
    {
        $db = \Config\Database::connect();
        $denuncias = $db->table('denuncias')
            ->select('
            denuncias.tracking_code, 
            denuncias.estado, 
            denuncias.fecha_registro, 
            COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
            COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
            denunciados.nombre as denunciado_nombre, 
            denunciados.numero_documento as denunciado_dni, 
            motivos.nombre as motivo
        ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->where('denuncias.dni_admin', null)
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->where('denuncias.estado', ['registrado'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
    }
    public function receiveAdmin()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $dni_admin = $data['dni_admin'];
        $id = $this->generateId('seguimientoDenuncias');

        $id_denuncias = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();

        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id,
            'denuncia_id' => $id_denuncias['id'],
            'estado' => 'recibida',
            'comentario' => 'La denuncia ha sido recibida por el administrador',
            'fecha_actualizacion' => date('Y-m-d H:i:s'),
            'dni_admin' => $dni_admin
        ])) {
        }
        if ($update = $this->denunciasModel
            ->where('tracking_code', $code)
            ->set([
                'dni_admin' => $dni_admin,
                'estado' => 'recibida'
            ])
            ->update()
        ) {
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }
        if ($update) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'La denuncia recibida'
            ]);
        }
    }
    public function receivedAdmin()
    {
        $data = $this->request->getGet();
        $dni_admin = $data['dni_admin'];
        $db = \Config\Database::connect();
        $denuncias = $db->table('denuncias')
            ->select('
            denuncias.tracking_code, 
            denuncias.estado, 
            denuncias.fecha_registro, 
            denuncias.fecha_incidente,
            denuncias.descripcion,
            denuncias.motivo_otro,
            COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
            COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
            denunciados.nombre as denunciado_nombre, 
            denunciados.numero_documento as denunciado_dni, 
            motivos.nombre as motivo,
            seguimiento_denuncias.estado as seguimiento_estado,
            seguimiento_denuncias.comentario as seguimiento_comentario,
        ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->join('seguimiento_denuncias', 'denuncias.id = seguimiento_denuncias.denuncia_id', 'left')
            ->groupBy('denuncias.id')
            ->where('denuncias.dni_admin', $dni_admin)
            ->whereIn('denuncias.estado', ['en proceso', 'recibida'])
            ->get()
            ->getResult();

        return $this->response->setJSON($denuncias);
    }
    public function downloadAdjunto()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'] ?? null;
        if (!$code) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'El código de seguimiento es requerido'
            ]);
        }
        $denuncia = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Denuncia no encontrada'
            ]);
        }
        $folderPath = FCPATH . 'uploads/' . $denuncia['id'];
        if (!is_dir($folderPath)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontraron archivos adjuntos para esta denuncia'
            ]);
        }
        $hasFiles = false;
        foreach (new \DirectoryIterator($folderPath) as $fileInfo) {
            if (!$fileInfo->isDot() && !$fileInfo->isDir()) {
                $hasFiles = true;
                break;
            }
        }
        if (!$hasFiles) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'La carpeta de archivos adjuntos está vacía'
            ]);
        }
        $zipName = 'adjuntos_' . $code . '_' . time() . '.zip';
        $this->response->setHeader('Content-Type', 'application/zip');
        $this->response->setHeader('Content-Disposition', 'attachment; filename="' . $zipName . '"');
        $this->response->setHeader('Pragma', 'no-cache');
        $zip = new \ZipArchive();
        $tempFile = tempnam(sys_get_temp_dir(), 'zip');
        if ($zip->open($tempFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
            $fileCount = 0;
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($folderPath),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );
            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($folderPath) + 1);

                    if (substr($relativePath, 0, 1) !== '.') {
                        if ($zip->addFile($filePath, $relativePath)) {
                            $fileCount++;
                        }
                    }
                }
            }
            $zip->close();
            if ($fileCount === 0) {
                unlink($tempFile);
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontraron archivos válidos para comprimir'
                ]);
            }
            $this->response->setBody(file_get_contents($tempFile));
            unlink($tempFile);
            return $this->response;
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se pudo crear el archivo ZIP'
            ]);
        }
    }
    public function procesosDenuncia()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $id_denuncias = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();
        $dni_admin = $data['dni_admin'];
        $id = $this->generateId('seguimientoDenuncias');
        $estado = $data['estado'];
        $comentario = $data['comentario'];

        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id,
            'denuncia_id' => $id_denuncias['id'],
            'estado' => $estado,
            'comentario' => $comentario,
            'fecha_actualizacion' => date('Y-m-d H:i:s'),
            'dni_admin' => $dni_admin
        ])) {
        }
        if ($update = $this->denunciasModel
            ->where('tracking_code', $code)
            ->set([
                'estado' => $estado
            ])
            ->update()
        ) {
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }
        if ($update) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'La denuncia ha sido actualizada'
            ]);
        }
    }
    public function search()
    {
        $data = $this->request->getGet();
        $dni = $data['numero_documento'];
        
        $db = \Config\Database::connect();
        $denuncias = $db->table('denuncias')
            ->select('
                denuncias.id,
                denuncias.tracking_code,
                denuncias.motivo_id,
                denuncias.descripcion, 
                denuncias.fecha_registro,
                denuncias.estado,
                denuncias.motivo_otro,
                denunciados.nombre as denunciado_nombre,
                denunciados.numero_documento as denunciado_dni,
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre,
                COALESCE(denunciantes.numero_documento, "") as denunciante_dni,
                (
                    SELECT comentario FROM seguimiento_denuncias 
                    WHERE seguimiento_denuncias.denuncia_id = denuncias.id 
                    ORDER BY fecha_actualizacion DESC LIMIT 1
                ) as seguimiento_comentario
            ')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->where('denunciados.numero_documento', $dni)
            ->get()
            ->getResult();
        
        if (empty($denuncias)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontraron denuncias para este número de documento'
            ]);
        }
        
        return $this->response->setJSON([
            'success' => true,
            'data' => $denuncias
        ]);
    }
}
