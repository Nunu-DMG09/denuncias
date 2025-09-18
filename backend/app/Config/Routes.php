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

    $routes->get('consumidor/dni/(:num)', 'ConsultaApi::buscarDNI/$1');
    $routes->get('consumidor/ruc/(:num)', 'ConsultaApi::buscarRUC/$1');

    

    /*------ RUTAS DE CONSUMIDOR ------ */
    $routes->group('consumidor', ['namespace' => 'App\Controllers\denuncias_consumidor'], function ($routes) {
        /*---- RUTAS DE AUTENTICACION ----*/
        $routes->post('login', 'DenunciasConsumidor\v1\AuthController::login');    
        $routes->post('logout', 'DenunciasConsumidor\v1\AuthController::logout');
        $routes->get('refresh', 'DenunciasConsumidor\v1\AuthController::refresh');
        /*---- DENUNCIANTES ----*/
        $routes->group('denunciante', function ($routes) {
            // Listar todos los denunciantes
            $routes->get('/', 'DenunciasConsumidor\v1\DenuncianteController::index');
            // Mostrar un denunciante por ID
            $routes->get('show/(:num)', 'DenunciasConsumidor\v1\DenuncianteController::show/$1');
            // Crear denunciante (POST JSON)
            $routes->post('/', 'DenunciasConsumidor\v1\DenuncianteController::create');
            // Actualizar denunciante
            $routes->get('update/(:num)', 'DenunciasConsumidor\v1\DenuncianteController::update/$1');
            // Eliminar denunciante
            $routes->delete('delete/(:num)', 'DenunciasConsumidor\v1\DenuncianteController::delete/$1');
        });
        /*---- DENUNCIADOS ----*/
        $routes->group('denunciado', function ($routes) {
            // Listar todos los denunciados
            $routes->get('/', 'DenunciadoController::index');
            // Mostrar un denunciado por ID
            $routes->get('show/(:num)', 'DenunciasConsumidor\v1\DenunciadoController::show/$1');
            // Crear denunciado
            $routes->post('/', 'DenunciasConsumidor\v1\DenunciadoController::create');
            // Actualizar denunciado
            $routes->post('update/(:num)', 'DenunciasConsumidor\v1\DenunciadoController::update/$1');
            // Eliminar denunciado
            $routes->delete('delete/(:num)', 'DenunciasConsumidor\v1\DenunciadoController::delete/$1');
        });

        /*---- DENUNCIAS ----*/
        $routes->group('denuncias', function ($routes) {
            // Buscar denuncia por tracking_code
            $routes->get('codigo/(:alphanum)', 'DenunciasConsumidor\v1\DenunciaController::query/$1');
            // Listar todas las denuncias
            $routes->get('/', 'DenunciasConsumidor\v1\DenunciaController::index', ['filter' => 'auth:super_admin,admin']);
            $routes->post('/', 'DenunciasConsumidor\v1\DenunciaController::create');
            $routes->get('stats', 'DenunciasConsumidor\v1\AdminsController::getDenunciasStats', ['filter' => 'auth:super_admin,admin']);

            /*---- ADJUNTOS ----*/
            $routes->group('adjunto', function ($routes) {
                // Subir adjuntos junto con la denuncia (form-data)
                $routes->post('subir/(:num)', 'DenunciasConsumidor\v1\AdjuntoController::subirAdjuntos/$1');
                // Descargar todos los adjuntos en ZIP
                $routes->get('descargar/(:num)', 'DenunciasConsumidor\v1\AdjuntoController::descargarAdjuntos/$1');
            });
        });

        /*---- GRUPO DE ADMINISTRADORES ----*/

        $routes->group('admin', function ($routes) {

            // Dashboard y gestión de denuncias
            //$routes->get('dashboard', 'AdminsController::dashboard');

            // PARA RECIBIR DENUNCIAS ASIGNADAS A UN ADMINISTRADOR
            $routes->post('recibir', 'DenunciasConsumidor\v1\AdminsController::recibirAdmin', ['filter' => 'auth:super_admin,admin']);

            // PARA VER DENUCNIAS QUE TENGAN DE ESTADO "REGISTRADO"
            $routes->get('registradas', 'DenunciasConsumidor\v1\AdminsController::getRegistradas', ['filter' => 'auth:super_admin,admin']);
            // PARA VER DENUNCIAS "REGISTRADO" CON PAGINACION
            $routes->get('registradas/(:num)', 'DenunciasConsumidor\v1\AdminsController::getRegistradas/$1', ['filter' => 'auth:super_admin,admin']);
            // PARA VER DENUNCIAS ACTIVAS (EN PROCESO, PENDIENTE, RECIBIDO)
            $routes->get('activas', 'DenunciasConsumidor\v1\AdminsController::getDenunciasActivas', ['filter' => 'auth:super_admin,admin']);
            // PARA VER DENUNCIAS ACTIVAS CON PAGINACION
            $routes->get('activas/(:num)', 'DenunciasConsumidor\v1\AdminsController::getDenunciasActivas/$1', ['filter' => 'auth:super_admin,admin']);

            // PARA CAMBIAR EL ESTADO DE UNA DENUNCIA
            $routes->post('procesos-denuncia', 'DenunciasConsumidor\v1\AdminsController::procesosDenuncia', ['filter' => 'auth:super_admin,admin']);

            // Gestión de administradores
            $routes->get('/', 'DenunciasConsumidor\v1\AdminsController::getAdministradores', ['filter' => 'auth:super_admin']); 
            $routes->post('/', 'DenunciasConsumidor\v1\AdminsController::createAdministrador', ['filter' => 'auth:super_admin']);
            // actualizar administrador por DNI
            $routes->post('update/(:num)', 'DenunciasConsumidor\v1\AdminsController::updateAdministrador/$1', ['filter' => 'auth:super_admin']);
            // eliminar administrador por dni o id del administrador
            $routes->delete('delete-dni/(:num)', 'DenunciasConsumidor\v1\AdminsController::deleteAdministrador/$1', ['filter' => 'auth:super_admin']);
            $routes->delete('delete-id/(:num)', 'DenunciasConsumidor\v1\AdminsController::deleteAdministradorById/$1', ['filter' => 'auth:super_admin']);
            // Buscar Admins por dni o ids
            $routes->get('dni/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchAdminByDni/$1', ['filter' => 'auth:super_admin']);
            $routes->get('id/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchAdminById/$1', ['filter' => 'auth:super_admin']);
            // Buscar denuncias por dni o id del denunciante
            $routes->get('buscar-dni/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchDenuncias/$1', ['filter' => 'auth:super_admin,admin']);
            $routes->get('buscar-id/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchDenunciasByDenuncianteId/$1', ['filter' => 'auth:super_admin,admin']);
            
            // Buscar denuncias por documento del denunciado
            $routes->get('documento-1/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchDenunciaByDocumentoDenunciado/$1', ['filter' => 'auth:super_admin,admin']);
            // Buscar denuncias por nombre del denunciado
            $routes->get('nombre-1/(:any)', 'DenunciasConsumidor\v1\AdminsController::searchDenunciaByNombreDenunciado/$1', ['filter' => 'auth:super_admin,admin']);
            // Buscar denuncias por documento del denunciante
            $routes->get('documento-2/(:num)', 'DenunciasConsumidor\v1\AdminsController::searchDenunciaByDocumentoDenunciante/$1', ['filter' => 'auth:super_admin,admin']);
            // Buscar denuncias por nombre del denunciante
            $routes->get('nombre-2/(:any)', 'DenunciasConsumidor\v1\AdminsController::searchDenunciaByNombreDenunciante/$1', ['filter' => 'auth:super_admin,admin']);
            // Listar historial de acciones de administradores
            $routes->get('historial', 'DenunciasConsumidor\v1\AdminsController::listarHistorial', ['filter' => 'auth:super_admin']);
            // ASIGNAR DENUNCIADO A UNA DENUNCIA EXISTENTE 
            $routes->post('add-denunciado/(:num)', 'DenunciasConsumidor\v1\AdminsController::AddDenunciadoPanel/$1', ['filter' => 'auth:super_admin, admin']);
        });

        /*---- SEGUIMIENTO ----*/
        $routes->group('seguimiento', function ($routes) {
            // Crear seguimiento
            $routes->post('/', 'DenunciasConsumidor\v1\SeguimientoDenunciaController::create');
            // Buscar seguimientos por ID de denuncia
            $routes->get('show/(:num)', 'DenunciasConsumidor\v1\SeguimientoDenunciaController::getByDenunciaId/$1');
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
