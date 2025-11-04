<?php

namespace App\Models;

use App\Models\Tarea;
use App\Models\Entrega;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @use HasFactory<\Database\Factories\UserFactory>
 * @property string $role
 */
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // ADMIN, PROFESOR, ESTUDIANTE
        'puntos',
        'profesor_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function role(): Attribute {
        return Attribute::make(
            set: fn(string $value) => strtoupper($value)
        );
    }

    public function isAdmin(): bool {
        return $this->role === "ADMIN";
    }

    public function isProfesor(): bool {
        return $this->role === "PROFESOR" ||$this->role === "ADMIN";
    }

    public function isEstudiante(): bool {
        return $this->role === "ESTUDIANTE";
    }

    public function profesor(): BelongsTo {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function estudiantes(): HasMany {
        return $this->hasMany(User::class, 'profesor_id');
    }

    public function tareasCreadas(): HasMany {
        return $this->hasMany(Tarea::class, 'creador_id');
    }

    public function entregas(): HasMany {
        return $this->hasMany(Entrega::class, 'estudiante_id');
    }

    public function entregasCalificadas(): HasMany {
        return $this->hasMany(Entrega::class, 'calificador_id');
    }

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return ['role' => $this->role];
    }
}
