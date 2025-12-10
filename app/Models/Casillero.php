<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Casillero extends Model
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
    protected $table = 'casilleros';

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
        'numero_casillero',
        'tipo',
        'emp_id',
        'estatus',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'emp_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the empleado that owns the casillero.
     */
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'emp_id', 'Id');
    }

    /**
     * Scope a query to only include casilleros for hombres.
     */
    public function scopeHombres($query)
    {
        return $query->where('tipo', 'Hombres');
    }

    /**
     * Scope a query to only include casilleros for mujeres.
     */
    public function scopeMujeres($query)
    {
        return $query->where('tipo', 'Mujeres');
    }

    /**
     * Scope a query to only include casilleros with a specific estatus.
     */
    public function scopeEstatus($query, $estatus)
    {
        return $query->where('estatus', $estatus);
    }

    /**
     * Scope a query to only include available casilleros.
     */
    public function scopeDisponibles($query)
    {
        return $query->where('estatus', 'Disponible');
    }

    /**
     * Scope a query to only include occupied casilleros.
     */
    public function scopeOcupados($query)
    {
        return $query->where('estatus', 'Ocupado');
    }
}
