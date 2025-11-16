<?php

/*
 * Este código se encarga de mapear toda la aplicación a excepción de un par de rutas de las que se encargará el archivo
 * <<web.php>>. Esta es la manera que tendrá la parte frontend de la aplicación para comunicarse con el backend utilizando
 * las promesas de JS.
 */

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MusicaController;
use App\Http\Controllers\SpotifyAuthController;
use App\Http\Controllers\SpotifyTokenController;
use App\Http\Controllers\TareaController;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register')->name('register');
    Route::post('login', 'login')->name('login');
});

Route::get('tareas/ultimas', [TareaController::class, 'ultimasTareas']);
Route::get('tareas/profesor/{profesorId}', [TareaController::class, 'getTareasByProfesor']);
Route::get('spotify_token', [SpotifyTokenController::class, 'getSpotifyToken']);
Route::post("contacto", [ContactController::class, "send"]);


Route::middleware('auth:api')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::post('refresh', 'refresh');
        Route::get('me', 'me');
    });

    Route::controller(TareaController::class)->prefix('/tareas')->group(function () {
        // Listar todas
        Route::get('/', 'index');
        // Entregar
        Route::post('{tarea}/entregar', 'subirEntrega');
        // Ver mis entregas
        Route::get('mis-entregas', 'misEntregas');
    });

    Route::controller(MusicaController::class)->prefix('musica')->group(function () {
        Route::get('playlist', 'getPlaylist');
        Route::post('sugerir', 'sugerirCancion');
        Route::get('buscar-spotify', 'buscarSpotify');
    });

    Route::middleware('can:profesor-or-admin')->group(function () {
        Route::controller(TareaController::class)->prefix('/tareas')->group(function () {
            // Crear tarea
            Route::post('crear', 'store');
            // Ver entregas
            Route::get('{profesor_id}/entregas', 'entregasPorTarea');
            
        });
        
        // Calificar tarea
        Route::post('entregas/{entrega}/calificar', [TareaController::class, 'calificarEntrega']);

        // Ruta para ver TODAS las sugerencias
        Route::get('musica/sugerencias', [MusicaController::class, 'listado']);
    });

    Route::middleware('can:admin-only')->group(function () {
        Route::controller(SpotifyAuthController::class)->prefix('spotify')->group(function () {
            Route::post('redirect', 'redirect');
        });

        // Administracion de Playlist:
        // 1. Aceptar Sugerencia (Añadir a playlist)
        Route::post('musica/playlist/add', [MusicaController::class, 'anadirPlaylist']);

        // 2. Eliminar cancion de playlist (Eliminacion fisica)
        Route::delete('musica/playlist/eliminar', [MusicaController::class, 'eliminarCancionPlaylist']);

        // 3. Cancelar Sugerencia (Cambiar estado a CANCELADA)
        Route::post('musica/sugerencias/cancelar', [MusicaController::class, 'cancelarCancion']);
    });
});
