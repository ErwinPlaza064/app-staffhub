<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    /**
     * The connection name for the model.
     *
     * @var string
     */
    protected $connection = 'access';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'empleados';

    /**
     * The primary key associated with the table.
     * Access devuelve "Id" con mayúscula
     *
     * @var string
     */
    protected $primaryKey = 'Id';

    /**
     * Indicates if the IDs are auto-incrementing.
     * Desactivado para Access ya que no soporta lastInsertId()
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'numero_nomina',
        'nombre',
        'area',
        'puesto',
        'grupo',
        'genero',
        'fecha_baja',
        'motivo_baja',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fecha_baja' => 'datetime',
    ];

    /**
     * Scope para empleados activos (sin baja).
     */
    public function scopeActivos($query)
    {
        return $query->whereNull('fecha_baja');
    }

    /**
     * Scope para empleados dados de baja.
     */
    public function scopeBajas($query)
    {
        return $query->whereNotNull('fecha_baja');
    }

    /**
     * Verificar si el empleado está activo.
     */
    public function getEstaActivoAttribute()
    {
        return is_null($this->fecha_baja);
    }

    /**
     * Get the casillero associated with the empleado.
     */
    public function casillero()
    {
        return $this->hasOne(Casillero::class, 'emp_id', 'Id');
    }

    /**
     * Scope a query to only include empleados from a specific area.
     */
    public function scopeArea($query, $area)
    {
        return $query->where('area', $area);
    }

    /**
     * Scope a query to only include empleados from a specific grupo.
     */
    public function scopeGrupo($query, $grupo)
    {
        return $query->where('grupo', $grupo);
    }
}
