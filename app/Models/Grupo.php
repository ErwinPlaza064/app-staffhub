<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    protected $connection = 'access';
    protected $table = 'grupos';
    protected $primaryKey = 'Id';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
        'orden',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Scope para obtener solo grupos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Relación con empleados
     */
    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'grupo', 'nombre');
    }
}
