<?php

/*
 * UserController
 * =========================
 * Este controlador será el encargado de gestionar toda la parte de gestión del usuario, como actualizar los datos o
 * mostrar los datos de este. También habrá un método para mostrar los datos del profesor del usuario en el caso de que
 * este disponga de uno.
 */

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller {
    /*
     * Me
     * ============
     * Este método se encargará de gestionar todos los datos del usuario a excepción de la contraseña.
     *
     * Devolverá dichos datos los cuales son:
     *  1. Id
     *  2. Name
     *  3. Email
     *  4. Role
     *  5. Puntos
     *  6. Profesor_id
     */
    public function me() {
        $user = Auth::user();
        return response()->json($user->only(['id', 'name', 'email', 'role', 'puntos', 'profesor_id']));
    }

    /*
     * Update
     * ===============
     * Este método será el encargado de actualizar los datos del usuario (email y contraseña). Otra función a implementar
     * en un futuro sería la posibilidad de cambiar también su nombre, pero al ser una aplicación que se use en ámbitos
     * estudiantiles, no se da esa opción.
     *
     * Devolverá los datos actualizados
     */
    public function update(Request $request) {
        $user = Auth::user();
        if(!$user) {
            return response()->json(["error" => "Usuario no autenticado"], 401);
        }

        $validacion = Validator::make($request->all(), [
            'email' => 'sometimes|string|min:30|confirmed',
            'current_email' => 'nullable|required_with:email|string',
            'password' => 'sometimes|string|min:6|confirmed',
            'current_password' => 'nullable|required_with:password|string'
        ]);

        if($validacion->fails()) {
            return response()->json($validacion->errors(), 422);
        }

        $dataActualizar = [];

        if($request->filled('email')) {
            $currentEmail = $request->input("current_email");

            if($currentEmail !== $user->email) {
                return response()->json(['error' => 'El email actual que has ingresado no es correcto'], 403);
            }

            $dataActualizar['email'] = $request->email;
        }

        if($request->filled('password')) {
            $currentPassword = $request->input("current_password");

            if(!Hash::check($currentPassword, $user->password)) {
                return response()->json(["error" => "Contraseña actual incorrecta"], 403);
            }

            $dataActualizar['password'] = Hash::make($request->password);
        }

        if(empty($dataActualizar)) {
            return response()->json(["message" => "No se proporcionan datos suficientes para actualizar"], 422);
        }

        $user->update($dataActualizar);
        return response()->json($user->only(['id', 'name', 'email', 'role', 'puntos', 'profesor_id']), 200);
    }

    /*
     * ObtenerProfesor
     * =======================
     * Este método será el encargado de navegar por la base de datos para obtener el nombre y el correo del profesor del
     * alumno. Devolverá un array con dichos datos.
     */
    public function obtenerProfesor(Request $request) {
        $user = Auth::user();

        if($user->role !== "ESTUDIANTE" || empty($user->profesor_id)) {
            return response()->json([
                'message' => 'No eres estudiante o no tienes ningún profesor asignado',
                'profesor' => null
            ], 200);
        }

        $profesor = $user->profesor;

        if(!$profesor) {
            return response()->json([
                'error' => 'No se encontró el profesor con ese id'
            ], 404);
        }

        return response()->json([
            'nombre' => $profesor->name,
            'email' => $profesor->email
        ], 200);
    }

    /*
     * Crear
     * ===============
     * Método para crear un usuario. Será solo posible por el administrador y se requerirá enviar los siguientes datos:
     *  1. Nombre del nuevo usuario
     *  2. Email del nuevo usuario
     *  3. Rol del usuario. Posibles opciones:
     *      1. ESTUDIANTE --> Saldrá un nuevo campo de PROFESOR (donde se le asignará dicho profesor con un select)
     *      2. PROFESOR --> Saldrá un nuevo campo de ADMIN
     *
     * Devolverá un objeto json con la respuesta
     */
    public function crear(Request $request) {
        $user = Auth::user();

        if(!$user || $user->role !== "ADMIN") {
            return response()->json(["error" => "No tienes permisos suficientes para crear un usuario nuevo."], 403);
        }

        $validacion = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:ADMIN,ESTUDIANTE,PROFESOR',
            'profesor_id' => 'nullable|numeric|exists:users,id'
        ]);

        if($validacion->fails()) {
            return response()->json($validacion->errors(), 422);
        }

        $datosUsuario = $request->only(['name', 'email', 'role']);
        $datosUsuario["password"] = Hash::make($request->password);
        $datosUsuario["puntos"] = 0;

        if(strtoupper($datosUsuario["role"]) === "ESTUDIANTE") {
            if(!$request->filled('profesor_id')) {
                return response()->json(["error" => "El campo ID Profesor es obligatorio para los usuarios ESTUDIANTES"], 422);
            }

            // Comprobar que realmente ese usuario es profesor
            $profesor = User::find($request->profesor_id);
            if(!$profesor || ($profesor->isProfesor() && !$profesor->isAdmin())) {
                return response()->json(["error" => "El ID proporcionado no pertenece a un profesor o administrador"], 422);
            }

            $datosUsuario["profesor_id"] = $request->profesor_id;
        } elseif (strtoupper($datosUsuario["role"]) === "PROFESOR"
            || strtoupper($datosUsuario["role"] === "ADMIN")) {
            $datosUsuario["profesor_id"] = null;
        }

        try {
            $nuevo = User::create($datosUsuario);

            return response()->json([
                'message' => 'El usuario se ha creado correctamente',
                'user' => $nuevo,
            ], 201);
        } catch(\Exception $e) {
            return response()->json([
                "error" => "Error al crear el usuario. Por favor, asegurate que los datos sean correctos."
            ], 500);
        }
    }

    /*
     * ObtenerProfesores
     * ========================
     * Este método se encargará de obtener el nombre y el email de todos los usuarios con rol profesor o admin, para que
     * se pueda asignar dicho usuario a un estudiante.
     */
    public function obtenerProfesores() {
        $usuarioActual = Auth::user();

        if($usuarioActual->role !== "ADMIN") {
            return response()->json([
                "error" => "No tienes suficientes permisos para ver los profesores"
            ], 403);
        }

        $profesores = User::where("role", ["PROFESOR", "ADMIN"])
            ->get(["id", "name", "email", "role"]);

        return response()->json([
            "profesores" => $profesores,
        ], 200);
    }

    /*
     * ObtenerUsuarios
     * ========================
     * Este método se encargará de mostrar al ADMIN y a los PROFESORES un listado de los usuarios divididos
     * de la siguiente manera:
     *  1. ADMIN
     *      - Podrá ver TODOS los usuarios registrados en la aplicación
     *  2. PROFESORES
     *      - Podrán ver TODOS los alumnos que tienen a su cargo
     */
    public function obtenerUsuarios() {
        $usuarioActual = Auth::user();

        $todos = User::all(["id", "name", "email", "role", "puntos", "profesor_id"]);

        $misAlumnos = User::where("profesor_id", $usuarioActual->id)
            ->get(["id", "name", "email", "puntos"]);

        if($usuarioActual->role === "ADMIN") {
            return response()->json([
                "usuarios" => $todos
            ], 200);
        } elseif($usuarioActual->role === "PROFESOR") {
            return response()->json([
                "usuarios" => $misAlumnos
            ], 200);
        }

        return response()->json([
            "error" => "No tienes permisos suficientes para ver el resto de usuarios"
        ], 403);
    }
}
