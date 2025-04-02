<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('(:any)', 'CorsController::options');
$routes->get('login', 'Home::index');
$routes->get('/', 'Home::index');
$routes->post('login', 'AdminController::login');
$routes->get('register', 'AdminController::registerPrueba');
$routes->get('admin-info', 'AdminController::getAdminInfo');
// Rutas para la API
$routes->group('api', function ($routes) {
    $routes->get('dni/(:num)', 'ConsultaApi::buscarDNI/$1');
    $routes->get('ruc/(:num)', 'ConsultaApi::buscarRUC/$1');
    $routes->get('tracking/(:alphanum)', 'FormularioDenunciasController::query/$1');
});
$routes->group('form', function ($routes) {
    $routes->get('motivos', 'FormularioDenunciasController::index');
    $routes->post('create', 'FormularioDenunciasController::create');
});

// Rutas para el administrador
$routes->group('admin', ['filter' => 'auth'], function ($routes) {
    $routes->get('denuncias', 'GestionController::dashboard');
    $routes->get('recibida', 'GestionController::receivedAdmin');
    $routes->get('mandar', 'GestionController::receiveAdmin');
    $routes->get('updateDenuncia', 'GestionController::procesosDenuncia');
    $routes->get('search', 'GestionController::search');
    $routes->get('download', 'GestionController::downloadAdjunto');
    $routes->get('administradores', 'AdminController::getAdministradores');

    // Rutas que requieren ser super_admin
    $routes->group('', ['filter' => 'auth:super_admin'], function ($routes) {
        $routes->post('administradores', 'AdminController::createAdministrador');
        $routes->get('update', 'AdminController::updateAdministrador');
        $routes->get('history','AdminController::historyAdmin');
    });
});