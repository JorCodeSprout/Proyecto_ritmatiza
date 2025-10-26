<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class SpotifyApiService {
    protected Client $cliente;
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;
    protected string $baseUrl = 'https://api.spotify.com/v1/';

    public function __construct() {
        $this->clientId = config('services.spotify.client_id');
        $this->clientSecret = config('services.spotify.client_secret');
        $this->redirectUri = config('services.spotify.redirect_uri'); 

        $this->cliente = new Client();
    }

    public function getAuthUrl(string $scope, string $state): string {
        $params = [
            'client_id' => $this->clientId,
            'response_type' => 'code',
            'redirect_uri' => $this->redirectUri,
            'scope' => $scope,
            'state' => $state,
            // Obliga a Spotify a mostrar la pantalla de login/consentimiento
            'show_dialog' => true,
        ];

        return 'https://accounts.spotify.com/authorize?' . http_build_query($params);
    }

    public function getAccessToken(string $code) {
        try {
            $response = $this->cliente->post('https://accounts.spotify.com/api/token', [
                'form_params' => [
                    'grant_type' => 'authorization_code',
                    'code' => $code,
                    'redirect_uri' => $this->redirectUri,
                    // 'client_id' => $this->clientId,
                    // 'client_secret' => $this->clientSecret,
                ],
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret), 
                ]
            ]);

            return json_decode((string) $response->getBody(), true);
        } catch(ClientException $e) {
            Log::error("Spotify Auth Error (Code Exchange): " . $e->getMessage());
            throw $e;
        }
    }

    public function refreshAccessToken(string $refreshToken): array {
        try {   
            $response = $this->cliente->post('https://accounts.spotify.com/api/token', [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ],
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret),
                ]
            ]);

            return json_decode((string) $response->getBody(), true);
        } catch(ClientException $e) {
            Log::error("Spotify Auth Error (Refresh Token): " . $e->getMessage());
            throw $e;
        }
    }

    public function obtenerUsuario(string $accessToken): array 
    {
        try {
            $response = $this->cliente->get($this->baseUrl . 'me', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);
            return json_decode((string) $response->getBody(), true);
        } catch(ClientException $e) {
            Log::error("Spotify API Get User Error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Summary of buscarCanciones
     * @param string $query --> Cadena de búsqueda
     * @param string $accessToken --> Token de acceso
     */
    public function buscarCanciones(string $query, string $accessToken): array {
        try {
            $response = $this->cliente->get($this->baseUrl . 'search', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
                'query' => [
                    'q' => $query,
                    'type' => 'track', 
                    'limit' => 10,
                ],
            ]);

            return json_decode((string) $response->getBody(), true);
        } catch(ClientException $e) {
            Log::error("Spotify API Search Error: " . $e->getMessage());
            return ['error' => 'Error al buscar en Spotify'];
        }
    }

    /**
     * @param string $trackUri --> URI de la canción
     * @param string $playlistId --> ID de la playlist destino
     * @param string $accessToken --> Token de acceso del Admin
     */
    public function anadirCancion(string $trackUri, string $playlistId, string $accessToken) {
        try {
            $this->cliente->post($this->baseUrl . "playlist/{$playlistId}/tracks", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'uris' => [$trackUri],
                ],
            ]);

            return true;
        } catch(ClientException $e) {
            Log::error("Spotify API Add Track Error: " . $e->getMessage());
            return false;
        }
    }
}