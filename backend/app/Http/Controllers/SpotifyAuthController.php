<?php

namespace App\Http\Controllers;


use App\Services\SpotifyApiService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SpotifyAuthController extends Controller
{
    protected SpotifyApiService $spotifyService;
    private const CACHE_KEY_PREFIX = 'spotify_admin_tokens_';
    private const CACHE_STATE_PREFIX = 'spotify_auth_state_';

    public function __construct(SpotifyApiService $spotifyService)
    {
        $this->spotifyService = $spotifyService;
    }

    /**
     * Paso 1: Redirige al ADMIN a la página de autorización de Spotify.
     * Genera y almacena el parámetro 'state' para prevención de CSRF.
     */
    public function redirect(Request $request)
    {
        // El usuario debe estar autenticado vía JWT
        $user = auth()->user();
        if (Gate::denies('admin-only', $user)) {
            return response()->json(['error' => 'Acceso no autorizado. Se requiere rol de Admin.'], 403);
        }

        // Generar un estado aleatorio para prevenir CSRF
        $state = Str::random(40);

        // Almacenar el estado en la sesión para validación posterior
        // Usamos la ID del usuario para diferenciar la sesión si fuera necesario, aunque la sesión
        // de Laravel ya es única.
        // $request->session()->put('spotify_auth_state', $state);
        $cacheState = self::CACHE_STATE_PREFIX . $user->id;
        // Se guarda en la cache por 5min
        Cache::put($cacheState, $state, 300);

        // Definimos los permisos necesarios (scope)
        $scope = 'playlist-modify-public user-read-private'; 

        $authUrl = $this->spotifyService->getAuthUrl($scope, $state);

        // Devolvemos la URL para que el frontend redirija al usuario.
        return response()->json([
            'auth_url' => $authUrl
        ]);
    }

    /**
     * Paso 2: Recibe el código de Spotify, valida el 'state' e intercambia por Access Token.
     */
    public function callback(Request $request)
    {
        $user = auth()->user();
        if (Gate::denies('admin-only', $user)) {
            return response()->json(['error' => 'Acceso no autorizado.'], 403);
        }

        // 1. **VALIDACIÓN DE SEGURIDAD (CSRF):** Comparar el 'state' de la petición con el almacenado en sesión.
        $sessionState = $request->session()->pull('spotify_auth_state');
        $requestState = $request->input('state');

        if (!$requestState || $requestState !== $sessionState) {
            Log::error('Spotify Auth: Posible ataque CSRF detectado o estado no coincidente.');
            return response()->json(['error' => 'Falló la verificación de seguridad (STATE).'], 400);
        }

        if ($request->has('error')) {
            Log::error('Spotify Auth Error: ' . $request->input('error'));
            return response()->json(['error' => 'La autorización de Spotify ha fallado.'], 400);
        }

        $code = $request->input('code');

        if (!$code) {
            return response()->json(['error' => 'Falta el código de autorización.'], 400);
        }

        try {
            // 2. Intercambia el código por tokens
            $tokens = $this->spotifyService->getAccessToken($code);
            
            // 3. **ALMACENAMIENTO SEGURO Y PERSISTENTE:** Guardar los tokens en la caché
            // La clave de caché es única para el administrador (auth()->id())
            $cacheKey = self::CACHE_KEY_PREFIX . $user->id;

            Cache::put($cacheKey, [
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at' => now()->addSeconds($tokens['expires_in']),
            ], $tokens['expires_in']); // Almacenar por el tiempo de vida del token

            // Opcionalmente, podemos obtener el ID del usuario de Spotify para confirmación
            $spotifyUser = $this->spotifyService->obtenerUsuario($tokens['access_token']);

            Log::info("Spotify tokens guardados en caché para el Admin.", ['admin_id' => $user->id, 'spotify_user_id' => $spotifyUser['id'] ?? 'N/A']);

            return response()->json([
                'message' => 'Autenticación de Spotify exitosa. Tokens guardados en caché.',
                'spotify_user_id' => $spotifyUser['id'] ?? null
            ]);

        } catch (\Exception $e) {
            Log::error("Fallo al intercambiar el código por tokens: " . $e->getMessage());
            return response()->json(['error' => 'Fallo al obtener los tokens de Spotify.'], 500);
        }
    }
}