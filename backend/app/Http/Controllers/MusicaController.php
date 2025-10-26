<?php

namespace App\Http\Controllers;

use App\Models\CancionPlaylist;
use App\Models\Sugerencia;
use App\Services\SpotifyApiService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class MusicaController extends Controller {
    protected SpotifyApiService $spotifyApiService;

    public function __construct(SpotifyApiService $spotifyService) {
        $this->middleware('auth:api');
        $this->spotifyApiService = $spotifyService;
    }

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
            'sugerida_por_id' => Auth::id(),
            'estado' => 'PENDIENTE',
        ]);

        return response()->json(['message' => 'Sugerencia enviada para revisión', 'sugerencia' => $sugerencia], 201);
    }

    public function listado() {
        if(Gate::denies('profesor-or-admin')) {
            return response()->json(Sugerencia::with('sugeridaPor')->get());
        }

        return response()->json(Sugerencia::all());
    }

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

    public function getPlaylist() {
        return response()->json(CancionPlaylist::all());
    }

    public function buscarSpotify(Request $request) {
        $validado = Validator::make($request->all(), [
            'query' => 'required|string|min:3',
        ]);

        if($validado->fails()) {
            return response()->json($validado->errors(), 422);
        }

        return response()->json([
            'message' => 'Funcionalidad de búsqueda simulada. Se require un token real.',
            'query' => $request->query,
        ]);
    }
}