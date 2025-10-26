<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sugerencia extends Model {
    use HasFactory;

    protected $fillable = [
        'id_spotify_cancion',
        'artista',
        'titulo',
        'sugerida_por_id',
        'estado', // APROBADA, SUSPENDIDA, PENDIENTE
    ];

    public function sugeridaPor(): BelongsTo {
        return $this->belongsTo(User::class, 'sugerida_por_id');
    }
}