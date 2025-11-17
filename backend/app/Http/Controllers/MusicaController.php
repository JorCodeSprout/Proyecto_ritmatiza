<?php

/*
 * MusicaController
 * =========================
 * Este controlador será el encargado de gestionar toda la parte de las solicitudes de canciones, en donde habrá una
 * parte de solicitud, una de aceptar o cancelar dicha solicitud la cual si es así se añadirá la canción a una playlist,
 * listar todas las canciones que haya actualmente en dicha playlist y la gestión de un buscador de canciones. Todo esto
 * se utilizará en unión con la API de Spotify.
 */
namespace App\Http\Controllers;

use App\Models\CancionPlaylist;
use App\Models\Sugerencia;
use App\Services\SpotifyApiService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MusicaController extends Controller {
    protected SpotifyApiService $spotifyApiService;

    public function __construct(SpotifyApiService $spotifyService) {
        $this->middleware('auth:api');
        $this->spotifyApiService = $spotifyService;
    }

    /*
     * SugerirCancion
     * ===================
     * Método que se encarga de añadir las solicitudes a la base de datos mediante un botón que contiene los datos
     * id_spotify_cancion --> Envía el código de identificación de la canción en Spotify
     * titulo --> Envía el título de la canción
     * artista --> Envía el o los artistas que participan en la canción
     *
     * Además de los datos que se enviarán con el botón de la canción, también se enviará
     * sugerencia_por_id --> Contiene el id del usuario que hizo la solicitud
     * estado --> Por defecto se le dará el valor de PENDIENTE, el cual cambiará una vez que se acepte o se cancele la
     *            solicitud.
     *
     * Devuelve con objeto JSON que contiene un mensaje de notificación de que se ha enviado la solicitud y los datos de
     * la sugerencia enviada.
     */
    public function sugerirCancion(Request $request) {
        $validado = Validator::make($request->all(), [
            'id_spotify_cancion' => 'required|string|max:100|unique:sugerencias,id_spotify_cancion',
            'titulo' => 'required|string|max:255',
            'artista' => 'required|string|max:255'
        ]);

        if($validado->fails()) {
            return response()->json($validado->errors(), 422);
        }

        $sugerencia = Sugerencia::create([
            'id_spotify_cancion' => $request->id_spotify_cancion,
            'titulo' => $request->titulo,
            'artista' => $request->artista,
            'sugerencia_por_id' => Auth::id(),
            'estado' => 'PENDIENTE',
        ]);

        return response()->json(['message' => 'Sugerencia enviada para revisión', 'sugerencia' => $sugerencia], 201);
    }

    /*
     * Listado
     * =============
     * Se mostrará un listado con las canciones sugeridas. Habrá dos opciones:
     * 1.- Eres profesor o admin
     *          En este caso se mostrarán todas las sugerencias recibidas que no hayan sido procesadas todavía
     * 2.- No eres profesor o admin
     *          En este caso se te mostrarán solo las sugerencias que has realizado tú
     */
    public function listado() {
        Gate::allows('profesor-or-admin')
            ? $sugerencias = Sugerencia::with('sugerencia_por_id')
                    ->where('estado', 'PENDIENTE')
                    ->get()
            : $sugerencias = Sugerencia::with('sugerencia_por_id')
                    ->where('sugerencia_por_id', Auth::id())
                    ->get();

        return response()->json($sugerencias);
    }

    /*
     * AnadirPlaylist
     * ===================
     * En este caso el único que tendrá acceso será el administrador, entonces si no lo eres, no te dejará añadir ninguna
     * canción a la playlist y en ese caso te mostrará un mensaje de error de acceso.
     * En este método se cogerán todos los datos del método sugerirCancion y los enviará a otra tabla de la base de datos
     * la cual contendrá el id del administrador que ha aceptado la solicitud.
     *
     * En el caso de ser añadida a la playlist, la canción pasará a tener un estado de APROBADA.
     */
    public function anadirPlaylist(Request $request) {
        if(Gate::denies('admin-only')) {
            return response()->json(['error' => 'Solo el administrador puede gestionar la playlist']);
        }

        $validado = Validator::make($request->all(), [
            'id_spotify_cancion' => 'required|string|max:100|unique:canciones_playlist,id_spotify_cancion',
            'titulo' => 'required|string|max:255',
            'artista' => 'required|string|max:255',
        ]);

        if($validado->fails()) {
            return response()->json($validado->errors(), 422);
        }

        $cancion = CancionPlaylist::create([
            'id_spotify_cancion' => $request->id_spotify_cancion,
            'titulo' => $request->titulo,
            'artista' => $request->artista,
            'anadida_por_id' => Auth::id(),
        ]);

        Sugerencia::where('id_spotify_cancion', $request->id_spotify_cancion)
            ->update(['estado' => 'APROBADA']);

        return response()->json(['message' => 'Canción añadida a la playlist', 'cancion' => $cancion], 201);
    }

    /*
     * CancelarCancion
     * ===================
     * Este método se encargará de actualizar la base de datos que gestiona las canciones sugeridas por los usuarios
     * haciendo que si una canción no es válida para ser añadida a la playlist simplemente será descartada y establecida
     * con un estado de SUSPENDIDA. Al igual que anadirPlaylist será necesario ser admin para poder realizar cambios en
     * la playlist, por lo que si no eres administrador, se te mostrará un mensaje de error de acceso.
     *
     * Devolverá un mensaje de que se ha cancelado la sugerencia o en el caso de que ocurra algun error, se mostrará
     * un mensaje de error 404 al encontrar la solicitud con dicho id.
     */
    public function cancelarCancion(Request $request) {
        if(Gate::denies('admin-only')) {
            return response()->json(['error' => 'Solo el administrador puede gestionar la playlist']);
        }

        $validado = Validator::make($request->all(), [
            'id_spotify_cancion' => 'required|string|max:100|unique:canciones_playlist,id_spotify_cancion',
            'titulo' => 'required|string|max:255',
            'artista' => 'required|string|max:255',
        ]);

        if($validado->failed()) {
            return response()->json($validado->errors(), 422);
        }

        $id_cancion = $request->id_spotify_cancion;

        $actualizar = Sugerencia::where('id_spotify_cancion', $id_cancion)
            ->update(['estado' => 'SUSPENDIDA']);

        if($actualizar > 0) {
            return response()->json([
                'message' => 'Sugenerencia cancelada.',
                'id_spotify_cancion' => $id_cancion,
            ]);
        }

        return response()->json([
            'error' => 'No se encontró ninguna sugerencia pendiente con ese ID de Spotify'
        ], 404);
    }

    /*
     * getPlaylist
     * ================
     * Este método se encargará de recuperar todas las canciones que haya en la playlist en el momento en el que se
     * llame a dicho método.
     */
    public function getPlaylist() {
        return response()->json(CancionPlaylist::all());
    }

    /*
     * buscarSpotify
     * ===================
     * Este método será el encargado de interactuar con la API, el cual recibe una solicitud (query) y con la API de Spotify
     * mostrará los resultados que se adapten a dicha query, la cual ha de ser una canción, un artista o un album.
     */
    public function buscarSpotify(Request $request) {
        $validado = Validator::make($request->all(), [
            'query' => 'required|string|min:3'
        ]);

        if($validado->failed()) {
            return response()->json($validado->errors(), 422);
        }

        $token = $this->spotifyApiService->getClientCredentialsToken();

        if(!$token) {
            return response()->json(['error' => 'No se ha podido obtener el token de autorización de Spotify'], 503);
        }

        try {
            $response = Http::withToken($token)->get('https://api.spotify.com/v1/search', [
                'q' => $request->query,
                'type' => 'artist,album,track',
                'limit' => 10
            ]);

            if($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Ha habido un problema en la búsqueda',
                'details' => $response->json()
            ], $response->getStatusCode());
        } catch(Exception $e) {
            Log::error(`Error al intentar buscar en Spotify: {$e->getMessage()}`);
            return response()->json(['error' => 'Error de conexión con Spotify'], 500);
        }
    }
}
