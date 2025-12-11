<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CasilleroFoto extends Model
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
    protected $table = 'casillero_fotos';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'Id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

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
        'nombre',
        'descripcion',
        'ruta_imagen',
        'area',
        'activo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope para fotos activas.
     * En Access, los booleanos True son -1
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', -1);
    }

    /**
     * Scope para filtrar por área.
     */
    public function scopeArea($query, $area)
    {
        return $query->where('area', $area);
    }

    /**
     * Get the full URL of the image.
     */
    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->ruta_imagen);
    }
}
