<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
// Rutas para la API
$routes->group('api', function ($routes) {
    $routes->get('dni/(:num)', 'ConsultaApi::buscarDNI/$1');
    $routes->get('ruc/(:num)', 'ConsultaApi::buscarRUC/$1');
    $routes->get('tracking/(:alphanum)', 'FormularioDenunciasController::query/$1');
});
$routes->group('form', function ($routes) {
    $routes->get('motivos', 'FormularioDenunciasController::index');
    $routes->post('create', 'FormularioDenunciasController::create');
    $routes->options('create', 'FormularioDenunciasController::options');
    // $routes->post('query', 'FormularioDenunciasController::query');
    // $routes->options('query', 'FormularioDenunciasController::options');
});
$routes->post('upload', 'UploadController::upload');