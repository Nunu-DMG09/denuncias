<?php

namespace App\Controllers;

class CorsController extends BaseController
{
    public function options($any = null)
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setHeader('Access-Control-Max-Age', '86400')
            ->setStatusCode(200);
    }
}
