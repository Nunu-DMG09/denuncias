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
});
$routes->group('form', function ($routes) {
    $routes->get('create', 'FormularioDenunciasController::create');
});