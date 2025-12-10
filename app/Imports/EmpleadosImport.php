<?php

namespace App\Imports;

use App\Models\Empleado;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;

class EmpleadosImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    use SkipsErrors;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Crear el empleado usando insert para obtener el ID
        DB::connection('access')->table('empleados')->insert([
            'numero_nomina' => $row['numero_de_nomina'],
            'nombre' => $row['nombre_completo'],
            'area' => $row['area'],
            'puesto' => $row['puesto'],
            'grupo' => $row['grupo'],
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return null; // No usar Eloquent create debido a limitaciones de Access
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'numero_de_nomina' => 'required|size:5|unique:access.empleados,numero_nomina',
            'nombre_completo' => 'required|string|min:3',
            'area' => 'required|in:Staff,Calidad,Producción,Almacén,Mantenimiento',
            'puesto' => 'required|string',
            'grupo' => 'required|in:A,B,C,MIXTO',
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'numero_de_nomina.required' => 'El número de nómina es obligatorio',
            'numero_de_nomina.size' => 'El número de nómina debe tener exactamente 5 dígitos',
            'numero_de_nomina.unique' => 'El número de nómina ya existe',
            'nombre_completo.required' => 'El nombre es obligatorio',
            'nombre_completo.min' => 'El nombre debe tener al menos 3 caracteres',
            'area.required' => 'El área es obligatoria',
            'area.in' => 'El área debe ser: Staff, Calidad, Producción, Almacén o Mantenimiento',
            'puesto.required' => 'El puesto es obligatorio',
            'grupo.required' => 'El grupo es obligatorio',
            'grupo.in' => 'El grupo debe ser: A, B, C o MIXTO',
        ];
    }
}
