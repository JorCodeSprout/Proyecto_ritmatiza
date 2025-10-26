<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicaController;
use App\Http\Controllers\SpotifyAuthController;
use App\Http\Controllers\TareaController;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register')->name('register');
    Route::post('login', 'login')->name('login');
});

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
        Route::get('playlist', 'getPlaylsit');
        Route::post('sugerir', 'sugerirCancion');
        Route::get('buscar-spotify', 'buscarSpotify');
    });

    Route::middleware('can:profesor-or-admin')->group(function () {
        Route::controller(TareaController::class)->prefix('/tareas')->group(function () {
            // Crear tarea
            Route::post('/', 'store');
            // Ver entregas
            Route::get('{tarea}/entregas', 'entregasPorTarea');
            
            // Calificar tarea
            Route::post('entregas/{entrega}/calificar', 'calificarEntrega');
        });

        Route::get('musica/sugerencias', [MusicaController::class, 'listado']);
    });

    Route::middleware('can:admin-only')->group(function () {
        Route::controller(SpotifyAuthController::class)->prefix('spotify')->group(function () {
            Route::post('redirect', 'redirect');
            Route::get('callback', 'callback');
        });

        Route::post('playlist/add', [MusicaController::class, 'anadirPlaylist']);
    });
});