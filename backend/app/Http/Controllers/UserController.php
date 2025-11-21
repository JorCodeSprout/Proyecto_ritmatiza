<?php

/*
 * UserController
 * =========================
 * Este controlador será el encargado de gestionar toda la parte de gestión del usuario, como actualizar los datos o
 * mostrar los datos de este. También habrá un método para mostrar los datos del profesor del usuario en el caso de que
 * este disponga de uno.
 */

namespace App\Http\Controllers;

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
}
