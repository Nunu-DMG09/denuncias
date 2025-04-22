<?php

namespace App\Denuncias\Controllers;

use App\Controllers\BaseController;

class CorsController extends BaseController
{
    public function options($any = null)
    {
        $frontendOrigin = env('frontend.baseURL', 'http://localhost:5173');
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', $frontendOrigin)
            ->setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Content-Disposition')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setHeader('Access-Control-Max-Age', '86400')
            ->setStatusCode(200);
    }
}
