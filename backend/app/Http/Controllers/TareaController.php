<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Models\Tarea;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class TareaController extends Controller {
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['ultimasTareas']]);
    }

    // METODOS PARA PROFESOR/ADMIN

    /**
     * Muestra todas las tareas
     */
    public function index() {
        return response()->json(Tarea::with('creador')->get());
    }

    /**
     * Crear tarea (NECESARIO SER PROFESOR O ADMIN)
     */
    public function store(Request $request) {
        if(Gate::denies('profesor-or-admin')) {
            return response()->json(['error' => 'No tienes permiso para crear tareas'], 403);
        }

        $validado = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'recompensa' => 'required|integer|min:1',
            'reenviar' => 'boolean',
        ]);

        if($validado->fails()) {
            return response()->json($validado->errors(), 422);
        }

        $tarea = Tarea::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'recompensa' => $request->recompensa,
            'creador_id' => Auth::id(),
        ]);

        return response()->json(['message' => 'Tarea creada exitosamente.', 'tarea' => $tarea], 200);
    }

    public function subirEntrega(Request $request, Tarea $tarea) {
        $validador = Validator::make($request->all(), [
            'ruta' => 'required|string|max:500',
        ]);

        if($validador->fails()) {
            return response()->json($validador->errors(), 422);
        }

        $entrega = Entrega::create([
            'ruta' => $request->ruta,
            'tarea_id' => $tarea->id,
            'estudiante_id' => Auth::id(),
            'estado' => 'PENDIENTE',
        ]);

        return response()->json(['message' => 'Entrega subida. Pendiente de calificación', 'entrega' => $entrega], 200);
    }

    public function calificarEntrega(Request $request, Entrega $entrega) {
        if(Gate::denies('profesor-or-admin')) {
            return response()->json(['error', 'No tienes permiso para calificar esta tarea'], 403);
        }

        $validado = Validator::make($request->all(), [
            'estado' => 'required|in:APROBADA,RECHAZADA',
        ]);

        if($validado->fails()) {
            return response()->json($validado->errors(), 422);
        }

        $entrega->estado = $request->estado;
        $entrega->calificador_id = Auth::id();
        $entrega->save();

        if($entrega->estado === 'APROBADA') {
            $puntosGanados = $entrega->tarea->recompensa;
            $estudiante = User::find($entrega->estudiante_id);
            $estudiante->increment('puntos', $puntosGanados);
        }

        return response()->json(['message' => 'Entrega calificada y puntos entregados', 'entrega' => $entrega], 200);
    }

    public function ultimasTareas() {
        $tareas = Tarea::with('creador')
            ->latest()
            ->limit(3)
            ->get();
            
        return response()->json($tareas); 
    }

    public function entregasPorTarea(Tarea $tarea) {
        if(Gate::denies('profesor-or-admin')) {
            return response()->json(['error' => 'No tienes permiso para ver todas las entregas'], 403);
        }

        $entregas = $tarea->entregas()->with('estudiante')->get();
        return response()->json($entregas);
    }

    public function misEntregas() {
        $entregas = Auth::user()->entregas()->with('tarea')->get();
        return response()->json($entregas);
    }

    /**
     * Obtiene las últimas 3 tareas creadas por un profesor específico.
     * @param int $profesorId El ID del profesor.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTareasByProfesor(int $profesorId)
    {
        $estudianteId = Auth::id();

        try {
            $tareas = Tarea::where('creador_id', $profesorId) 
                ->latest()
                ->limit(3)
                ->when($estudianteId, function ($query) use ($estudianteId) {
                    $query->with(['entregas' => function ($q) use ($estudianteId) {
                        $q->where('estudiante_id', $estudianteId)
                            ->latest() 
                            ->limit(1);
                    }]);
                })
                ->get();

            $tareasConEstado = $tareas->map(function ($tarea) {
                $entrega = $tarea->entregas->first(); 

                $tareaArray = $tarea->toArray();
                
                $tareaArray['estado_entrega'] = $entrega ? $entrega->estado : 'PENDIENTE'; 
                $tareaArray['entrega_id'] = $entrega ? $entrega->id : null; 
                unset($tareaArray['entregas']);

                return $tareaArray;
            });

            return response()->json($tareasConEstado, 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'No se pudieron recuperar las tareas.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}