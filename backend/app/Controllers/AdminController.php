<?php

namespace App\Controllers;
use App\Controllers\BaseController;
use App\Models\AdministradoresModel;
use Firebase\JWT\JWT;

class AdminController extends BaseController
{
    private $administradoresModel;
    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
    }
    public function login()
    {
        $data = $this->request->getJSON(true);
        $dni_admin = $data->dni_admin ?? '';
        $password = $data->password ?? '';
        $user = $this->administradoresModel
        ->where('dni_admin', $dni_admin)
        ->first();

        if ($user && password_verify($password, $user['password'])) {
            $key = 'your-secret-key'; 
            $payload = [
                'iat' => time(), 
                'exp' => time() + 3600, 
                'dni_admin' => $user['dni_admin'],
                'categoria' => $user['categoria'],
            ];
            $token = JWT::encode($payload, $key, 'HS256');
            return $this->response->setJSON(['token' => $token]);
        }
        return $this->response->setJSON(['error' => 'Credenciales incorrectas'], 401);
    }
}