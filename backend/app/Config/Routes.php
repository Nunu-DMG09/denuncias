<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Home::index');
$routes->post('login', 'AdminController::login');
$routes->options('login', 'FormularioDenunciasController::options');
$routes->get('register', 'AdminController::registerPrueba');
$routes->get('admin-info', 'AdminController::getAdminInfo');
$routes->options('admin-info', 'FormularioDenunciasController::options');
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
});
// Rutas para el administrador
$routes->group('admin', ['filter' => 'auth'], function ($routes) {
    $routes->get('denuncias', 'GestionController::dashboard');
    $routes->options('denuncias', 'FormularioDenunciasController::options');
    $routes->get('recibidas', 'GestionController::receivedAdmin');
    $routes->group('', ['filter' => 'auth:superadmin'], function ($routes) {});
});
