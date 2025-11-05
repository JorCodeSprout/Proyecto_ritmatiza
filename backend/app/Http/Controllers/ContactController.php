<?php

namespace App\Http\Controllers;

use App\Mail\SendContactForm;
use Config;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Log;

class ContactController extends Controller
{
    // private const EMAIL_RECEPCION = env('MAIL_USERNAME', "pruebasjorgead@gmail.com");

    public function index() {
        // 
    }

    public function send(Request $request) {
        // Validamos los datos del formulario
        $dataValidate = $this->validate($request, [
            "name" => "required|string|min:5|max:100",
            "email" => "required|string|max:255",
            "subject" => "required|string|min:5|max:100",
            "message" => "required|string|min:20|max:3000"
        ]);

        try {
            $emailRecepcion = env('MAIL_USERNAME', "pruebasjorgead@gmail.com");
            Mail::to($emailRecepcion)->send(new SendContactForm($dataValidate));

            return response()->json([
                'message' => '¡Mensaje enviado con éxito!',
                'status' => 'success'
            ], 200);
        } catch(Exception $e) {
            Log::error('Error al enviar el correo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde',
                'status' => 'error',
            ], 500);
        }
    }
}
