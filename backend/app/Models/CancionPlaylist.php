<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CancionPlaylist extends Model {
    use HasFactory;

    protected $table = 'canciones_playlist';

    protected $fillable = [
        'id_spotify_cancion',
        'titulo',
        'artista',
        'anadida_por_id',
    ];

    public function anadidaPor(): BelongsTo {
        return $this->belongsTo(User::class, 'anadida_por_id');
    }
}