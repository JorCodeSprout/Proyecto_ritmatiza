<?php

namespace App\Models;

use App\Models\User;
use App\Models\Entrega;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tarea extends Model {
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'recompensa',
        'creador_id',
        'reenviar',
    ];

    public function creador(): BelongsTo {
        return $this->belongsTo(User::class, 'creador_id');
    }

    public function entregas(): HasMany {
        return $this->hasMany(Entrega::class);
    }
}