<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entrega extends Model {
    use HasFactory;

    protected $table = 'entregas';

    protected $fillable = [
        'ruta',
        'estado', // PENDIENTE, APROBADA, SUSPENDIDA
        'estudiante_id',
        'tarea_id',
        'calificador_id',
    ];

    public function tarea(): BelongsTo {
        return $this->belongsTo(Tarea::class);
    }

    public function estudiante(): BelongsTo {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function calificador(): BelongsTo {
        return $this->belongsTo(User::class, 'calificador_id');
    }
}