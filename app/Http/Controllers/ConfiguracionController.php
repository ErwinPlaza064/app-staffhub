<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    /**
     * Mostrar el panel de configuración
     */
    public function index()
    {
        $areas = Area::orderBy('orden')->get();
        $grupos = Grupo::orderBy('orden')->get();

        return Inertia::render('Configuracion/Index', [
            'areas' => $areas,
            'grupos' => $grupos,
        ]);
    }

    /**
     * Guardar nueva área
     */
    public function storeArea(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:access.areas,nombre',
            'descripcion' => 'nullable|string|max:255',
        ], [
            'nombre.required' => 'El nombre del área es obligatorio',
            'nombre.unique' => 'Ya existe un área con este nombre',
        ]);

        DB::connection('access')->table('areas')->insert([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Área agregada exitosamente');
    }

    /**
     * Actualizar área
     */
    public function updateArea(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:access.areas,nombre,' . $id . ',Id',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ], [
            'nombre.required' => 'El nombre del área es obligatorio',
            'nombre.unique' => 'Ya existe un área con este nombre',
        ]);

        $area->update($validated);

        return redirect()->back()->with('success', 'Área actualizada exitosamente');
    }

    /**
     * Eliminar área
     */
    public function destroyArea($id)
    {
        $area = Area::findOrFail($id);

        // Verificar si hay empleados con esta área
        $count = DB::connection('access')
            ->table('empleados')
            ->where('area', $area->nombre)
            ->count();

        if ($count > 0) {
            return redirect()->back()->withErrors([
                'area' => "No se puede eliminar porque hay {$count} empleado(s) asignado(s) a esta área"
            ]);
        }

        $area->delete();

        return redirect()->back()->with('success', 'Área eliminada exitosamente');
    }

    /**
     * Guardar nuevo grupo
     */
    public function storeGrupo(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:20|unique:access.grupos,nombre',
            'descripcion' => 'nullable|string|max:255',
        ], [
            'nombre.required' => 'El nombre del grupo es obligatorio',
            'nombre.unique' => 'Ya existe un grupo con este nombre',
        ]);

        DB::connection('access')->table('grupos')->insert([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Grupo agregado exitosamente');
    }

    /**
     * Actualizar grupo
     */
    public function updateGrupo(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:20|unique:access.grupos,nombre,' . $id . ',Id',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ], [
            'nombre.required' => 'El nombre del grupo es obligatorio',
            'nombre.unique' => 'Ya existe un grupo con este nombre',
        ]);

        $grupo->update($validated);

        return redirect()->back()->with('success', 'Grupo actualizado exitosamente');
    }

    /**
     * Eliminar grupo
     */
    public function destroyGrupo($id)
    {
        $grupo = Grupo::findOrFail($id);

        // Verificar si hay empleados con este grupo
        $count = DB::connection('access')
            ->table('empleados')
            ->where('grupo', $grupo->nombre)
            ->count();

        if ($count > 0) {
            return redirect()->back()->withErrors([
                'grupo' => "No se puede eliminar porque hay {$count} empleado(s) asignado(s) a este grupo"
            ]);
        }

        $grupo->delete();

        return redirect()->back()->with('success', 'Grupo eliminado exitosamente');
    }

    /**
     * Reordenar áreas
     */
    public function reorderAreas(Request $request)
    {
        $validated = $request->validate([
            'areas' => 'required|array',
            'areas.*.id' => 'required|integer',
            'areas.*.orden' => 'required|integer',
        ]);

        foreach ($validated['areas'] as $areaData) {
            DB::connection('access')
                ->table('areas')
                ->where('Id', $areaData['id'])
                ->update(['orden' => $areaData['orden']]);
        }

        return redirect()->back()->with('success', 'Orden de áreas actualizado');
    }

    /**
     * Reordenar grupos
     */
    public function reorderGrupos(Request $request)
    {
        $validated = $request->validate([
            'grupos' => 'required|array',
            'grupos.*.id' => 'required|integer',
            'grupos.*.orden' => 'required|integer',
        ]);

        foreach ($validated['grupos'] as $grupoData) {
            DB::connection('access')
                ->table('grupos')
                ->where('Id', $grupoData['id'])
                ->update(['orden' => $grupoData['orden']]);
        }

        return redirect()->back()->with('success', 'Orden de grupos actualizado');
    }
}
