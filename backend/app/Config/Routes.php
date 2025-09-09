<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->group('/', ['filter' => 'cors'], function ($routes) {
    /*------ CORS ------ */
    $routes->options('(:any)', static function () {});

    /*------ MISC ------ */
    $routes->get('dni/(:num)', 'ConsultaApi::buscarDNI/$1');
    $routes->get('ruc/(:num)', 'ConsultaApi::buscarRUC/$1');

    /*------ RUTAS DE CONSUMIDOR ------ */
    $routes->group('consumidor', ['namespace' => 'App\Controllers\denuncias_consumidor'], function ($routes) {
        /*---- DENUNCIANTES ----*/
        $routes->group('denunciante', function ($routes) {
            // Listar todos los denunciantes
            $routes->get('/', 'DenuncianteController::index');
            // Mostrar un denunciante por ID
            $routes->get('show/(:num)', 'DenuncianteController::show/$1');
            // Crear denunciante (POST JSON)
            $routes->post('/', 'DenuncianteController::create');
            // Actualizar denunciante
            $routes->get('update/(:num)', 'DenuncianteController::update/$1');
            // Eliminar denunciante
            $routes->delete('delete/(:num)', 'DenuncianteController::delete/$1');
        });
        /*---- DENUNCIADOS ----*/
        $routes->group('denunciado', function ($routes) {
            // Listar todos los denunciados
            $routes->get('/', 'DenunciadoController::index');
            // Mostrar un denunciado por ID
            $routes->get('show/(:num)', 'DenunciadoController::show/$1');
            // Crear denunciado
            $routes->post('/', 'DenunciadoController::create');
            // Actualizar denunciado
            $routes->post('update/(:num)', 'DenunciadoController::update/$1');
            // Eliminar denunciado
            $routes->delete('delete/(:num)', 'DenunciadoController::delete/$1');
        });

        /*---- DENUNCIAS ----*/
        $routes->group('denuncias', function ($routes) {
            // Buscar denuncia por tracking_code
            $routes->get('codigo/(:alphanum)', 'DenunciaController::query/$1');
            // Listar todas las denuncias
            $routes->get('/', 'DenunciaController::index', ['filter' => 'auth:super_admin,admin']);
            $routes->post('/', 'DenunciaController::create');
            $routes->get('stats', 'AdminsController::getDenunciasStats', ['filter' => 'auth:super_admin,admin']);

            /*---- ADJUNTOS ----*/
            $routes->group('adjunto', function ($routes) {
                // Subir adjuntos junto con la denuncia (form-data)
                $routes->post('subir/(:num)', 'AdjuntoController::subirAdjuntos/$1');
                // Descargar todos los adjuntos en ZIP
                $routes->get('descargar/(:num)', 'AdjuntoController::descargarAdjuntos/$1');
            });
        });

        /*---- SEGUIMIENTO ----*/
        $routes->group('seguimiento', function ($routes) {
            // Crear seguimiento
            $routes->post('/', 'SeguimientoDenunciaController::create');
            // Buscar seguimientos por ID de denuncia
            $routes->get('show/(:num)', 'SeguimientoDenunciaController::getByDenunciaId/$1');
        });
    });

    $routes->group('corrupcion', ['namespace' => 'App\Controllers\denuncias_corrupcion'], function ($routes) {
        $routes->get('tracking/(:alphanum)', 'Denuncias\Client\FormularioController::query/$1');
        $routes->group('form', function ($routes) {
            $routes->get('motivos', 'Denuncias\Client\FormularioController::index');
            $routes->post('create', 'Denuncias\Client\FormularioController::create');
            $routes->get('check-connection', 'Denuncias\Client\FormularioController::checkConnection'); // New route
        });
    });
});
$routes->options('(:any)', 'CorsController::options');
$routes->get('login', 'Home::index');
$routes->get('/', 'Home::index');
$routes->post('login', 'Denuncias\Admin\VerificarController::login');
$routes->post('logout', 'Denuncias\Admin\VerificarController::logout');
$routes->get('admin-info', 'Denuncias\Admin\VerificarController::getAdminInfo');
$routes->get('download', 'Denuncias\Admin\GestionAdminController::downloadAdjunto');
$routes->get('tracking/(:alphanum)', 'Denuncias\Client\FormularioController::query/$1');
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
        $routes->get('history', 'Denuncias\Admin\GestionSuperAdmin::historyAdmin');
        $routes->get('searchAdmin', 'Denuncias\Admin\GestionSuperAdmin::searchAdmin');
        $routes->get('history', 'Denuncias\Admin\GestionSuperAdmin::historyAdmin');
    });
});
