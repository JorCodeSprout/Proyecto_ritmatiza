<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller {
    public function __construct() {

        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request) {
        $validacion = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);

        if($validacion->fails()) {
            return response()->json($validacion->errors(), 422);
        }

        $credenciales = $request->only('email', 'password');

        if(!$token = Auth::guard('api')->attempt($credenciales)) {
            return response()->json(['error' => 'No autorizado. Credenciales inválidas'], 401);
        }

        $user = Auth::guard('api')->user();

        return $this->respondWithToken($token, $user);
    } 

    public function register(Request $request) {
        $validacion = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);

        if($validacion->fails()) {
            return response()->json($validacion->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'ESTUDIANTE',
            'puntos' => 0
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }

    public function logout() {
        Auth::logout();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    public function me() {
        return response()->json(Auth::user());
    }

    public function refresh() {
        $user = Auth::user();
        $token = Auth::refresh();
        return $this->respondWithToken($token, $user);
    }

    protected function respondWithToken($token, $user) {
        $ttl = Config::get('jwt.ttl', 60);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $ttl * 60,
            'user' => $user
        ]);
    }
}