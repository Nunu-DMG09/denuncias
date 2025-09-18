<?php 

namespace App\Controllers\denuncias_consumidor\DenunciasConsumidor\v1;
use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\denuncias_consumidor\DenunciasConsumidor\v1\AdjuntoModel;


class AdjuntoController extends BaseController
{
    use ResponseTrait;

    protected $denunciaModel;
    protected $adjuntoModel;

    public function __construct()
    {
        $this->denunciaModel = new DenunciaModel();
        $this->adjuntoModel  = new AdjuntoModel();
    }

    
     // Subir uno o varios adjuntos para una denuncia
    
    public function subirAdjuntos($denunciaId)
    {
        $denunciaId = $this->request->getPost('denuncia_id');
        $savedFiles = [];

        if (!$denunciaId) {
            return $this->failValidationErrors('denuncia_id es obligatorio');
        }

        $uploadPath = FCPATH . 'denuncias/' . $denunciaId;

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $files = $this->request->getFiles();

        if (isset($files['adjuntos'])) {
            foreach ($files['adjuntos'] as $file) {
                if ($file->isValid() && !$file->hasMoved()) {

                    //  Seguridad: restringir MIME types
                    if (!in_array($file->getClientMimeType(), ['image/jpeg','image/png','application/pdf'])) {
                        return $this->fail('Tipo de archivo no permitido');
                    }

                    $newName = $file->getRandomName();
                    $file->move($uploadPath, $newName);

                    $filePath = 'denuncias/' . $denunciaId . '/' . $newName;
                    $savedFiles[] = $filePath;

                    $this->adjuntoModel->insert([
                        'denuncia_id' => $denunciaId,
                        'file_path'   => 'denuncias/' . $denunciaId . '/' . $newName
                    ]);
                }
            }
        }

        return $this->respondCreated([
            'success'     => true,
            'message'     => 'Denuncia y adjuntos creados con éxito',
            'denuncia_id' => $denunciaId,
            'files'       => $savedFiles
        ]);
    }

        public function descargarAdjuntos($denunciaId)
    {
        $adjuntos = $this->adjuntoModel->where('denuncia_id', $denunciaId)->findAll();

        if (empty($adjuntos)) {
            return $this->failNotFound('No hay adjuntos para esta denuncia');
        }

        $zip = new \ZipArchive();
        $zipFile = WRITEPATH . 'denuncia_' . $denunciaId . '.zip';

        

        if ($zip->open($zipFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return $this->failServerError('No se pudo crear el ZIP');
        }

        foreach ($adjuntos as $adjunto) {
            $filePath = $adjunto['file_path'];

            if (!preg_match('/^[A-Z]:\\\\|^\//i', $filePath)) { 
                $filePath = FCPATH . $filePath;
            }

            if (file_exists($filePath)) {
                $zip->addFile($filePath, basename($filePath));
            } else {
                log_message('error', 'Archivo no encontrado: ' . $filePath);
            }
        }

        $zip->close();
        
        if (!file_exists($zipFile)) {
            return $this->failServerError('El ZIP no se creó correctamente');
        }

        //  Descargar y borrar archivo temporal después
        $response = $this->response->download($zipFile, null)
            ->setFileName('denuncia_' . $denunciaId . '.zip')
            ->setContentType('application/zip');

        // eliminar ZIP después de enviarlo
        register_shutdown_function(function () use ($zipFile) {
            if (file_exists($zipFile)) {
                unlink($zipFile);
            }
        });

        return $response;
    }
}
