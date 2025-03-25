<?php
namespace App\Filters;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return redirect()->to('/login');
        }
        $token = substr($authHeader, 7);
        try {
            $decoded = JWT::decode($token, new Key('your-secret-key', 'HS256'));
            if ($arguments && !in_array($decoded->categoria, $arguments)) {
                return redirect()->to('/unauthorized'); // Redirigir si no tiene permisos
            }
        } catch (\Exception $e) {
            return redirect()->to('/login');
        }
    }
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
