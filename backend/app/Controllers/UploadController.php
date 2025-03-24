<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class UploadController extends ResourceController
{
    public function upload()
    {
        $files = $this->request->getFiles();
        $uploadPath = FCPATH . 'uploads/data_denuncias'; 

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $uploadedFiles = [];
        foreach ($files['files'] as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $file->move($uploadPath);
                $uploadedFiles[] = $file->getName();
            }
        }

        return $this->respond([
            'status' => 'success',
            'message' => 'Archivos subidos correctamente',
            'files' => $uploadedFiles,
        ]);
    }
}