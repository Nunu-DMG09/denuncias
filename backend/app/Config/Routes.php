<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('(:any)', 'Denuncias\CorsController::options');
$routes->get('login', 'Home::index');
$routes->get('/', 'Home::index');
$routes->post('login', 'Denuncias\Admin\VerificarController::login');
$routes->post('logout', 'Denuncias\Admin\VerificarController::logout');
$routes->get('admin-info', 'Denuncias\Admin\VerificarController::getAdminInfo');
$routes->get('download', 'Denuncias\Admin\GestionAdminController::downloadAdjunto');

// Rutas para la API
$routes->group('api', function ($routes) {
    $routes->get('dni/(:num)', 'Denuncias\ConsultaApi::buscarDNI/$1');
    $routes->get('ruc/(:num)', 'Denuncias\ConsultaApi::buscarRUC/$1');
    $routes->get('tracking/(:alphanum)', 'Denuncias\Client\FormularioController::query/$1');
});
$routes->group('form', function ($routes) {
    $routes->get('motivos', 'Denuncias\Client\FormularioController::index');
    $routes->post('create', 'Denuncias\Client\FormularioController::create');
    $routes->get('check-connection', 'Denuncias\Client\FormularioController::checkConnection'); // New route
});

// Rutas para el administrador
$routes->group('admin', ['filter' => 'auth'], function ($routes) {
    $routes->get('denuncias', 'Denuncias\Admin\GestionAdminController::dashboard');
    $routes->get('recibida', 'Denuncias\Admin\GestionAdminController::receivedAdmin');
    $routes->get('mandar', 'Denuncias\Admin\GestionAdminController::receiveAdmin');
    $routes->get('updateDenuncia', 'Denuncias\Admin\GestionAdminController::procesosDenuncia');
    $routes->get('search', 'Denuncias\Admin\GestionAdminController::search');
    $routes->get('administradores', 'Denuncias\Admin\GestionSuperAdmin::getAdministradores');

    // Rutas que requieren ser super_admin
    $routes->group('', ['filter' => 'auth:super_admin'], function ($routes) {
        $routes->post('administradores', 'Denuncias\Admin\GestionSuperAdmin::createAdministrador');
        $routes->post('update', 'Denuncias\Admin\GestionSuperAdmin::updateAdministrador');
        $routes->get('history','Denuncias\Admin\GestionSuperAdmin::historyAdmin');
        $routes->get('searchAdmin', 'Denuncias\Admin\GestionSuperAdmin::searchAdmin');
        $routes->get('history','Denuncias\Admin\GestionSuperAdmin::historyAdmin');
    });
});