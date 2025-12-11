<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\CasilleroController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| StaffHub Routes - Sistema de Gestión de Personal y Casilleros
|--------------------------------------------------------------------------
*/

// Home - Redirect to empleados
Route::get('/', function () {
    return redirect()->route('empleados.index');
});

// Empleados Routes
Route::get('/empleados', [EmpleadoController::class, 'index'])->name('empleados.index');
Route::post('/empleados', [EmpleadoController::class, 'store'])->name('empleados.store');
Route::put('/empleados/{id}', [EmpleadoController::class, 'update'])->name('empleados.update');
Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy'])->name('empleados.destroy');
Route::post('/empleados/{id}/baja', [EmpleadoController::class, 'baja'])->name('empleados.baja');
Route::post('/empleados/{id}/reactivar', [EmpleadoController::class, 'reactivar'])->name('empleados.reactivar');
Route::get('/api/empleados', [EmpleadoController::class, 'getData'])->name('empleados.data');
Route::get('/empleados/export', [EmpleadoController::class, 'export'])->name('empleados.export');
Route::post('/empleados/import', [EmpleadoController::class, 'import'])->name('empleados.import');
Route::get('/empleados/template', [EmpleadoController::class, 'downloadTemplate'])->name('empleados.template');
Route::get('/empleados/{id}/casilleros-disponibles', [EmpleadoController::class, 'casillerosDisponibles'])->name('empleados.casilleros-disponibles');
Route::post('/empleados/{id}/asignar-casillero', [EmpleadoController::class, 'asignarCasillero'])->name('empleados.asignar-casillero');


// Bajas Routes
Route::get('/bajas', [EmpleadoController::class, 'bajasIndex'])->name('bajas.index');

// Casilleros Routes
Route::get('/casilleros', [CasilleroController::class, 'index'])->name('casilleros.index');
Route::post('/casilleros', [CasilleroController::class, 'store'])->name('casilleros.store');
Route::put('/casilleros/{id}', [CasilleroController::class, 'update'])->name('casilleros.update');
Route::delete('/casilleros/{id}', [CasilleroController::class, 'destroy'])->name('casilleros.destroy');
Route::post('/casilleros/{id}/asignar', [CasilleroController::class, 'asignar'])->name('casilleros.asignar');
Route::post('/casilleros/{id}/liberar', [CasilleroController::class, 'liberar'])->name('casilleros.liberar');
Route::get('/api/casilleros', [CasilleroController::class, 'getData'])->name('casilleros.data');
Route::get('/casilleros/export-pdf', [CasilleroController::class, 'exportPdf'])->name('casilleros.export.pdf');

// Casillero Fotos 360° Routes
Route::get('/api/casilleros/fotos', [App\Http\Controllers\CasilleroFotoController::class, 'index'])->name('casilleros.fotos.index');
Route::post('/api/casilleros/fotos', [App\Http\Controllers\CasilleroFotoController::class, 'upload'])->name('casilleros.fotos.upload');
Route::delete('/api/casilleros/fotos/{id}', [App\Http\Controllers\CasilleroFotoController::class, 'destroy'])->name('casilleros.fotos.destroy');
Route::post('/api/casilleros/fotos/{id}/toggle', [App\Http\Controllers\CasilleroFotoController::class, 'toggleActive'])->name('casilleros.fotos.toggle');

// Configuración Routes
Route::get('/configuracion', [ConfiguracionController::class, 'index'])->name('configuracion.index');
Route::post('/configuracion/areas', [ConfiguracionController::class, 'storeArea'])->name('configuracion.areas.store');
Route::put('/configuracion/areas/{id}', [ConfiguracionController::class, 'updateArea'])->name('configuracion.areas.update');
Route::delete('/configuracion/areas/{id}', [ConfiguracionController::class, 'destroyArea'])->name('configuracion.areas.destroy');
Route::post('/configuracion/areas/reorder', [ConfiguracionController::class, 'reorderAreas'])->name('configuracion.areas.reorder');
Route::post('/configuracion/grupos', [ConfiguracionController::class, 'storeGrupo'])->name('configuracion.grupos.store');
Route::put('/configuracion/grupos/{id}', [ConfiguracionController::class, 'updateGrupo'])->name('configuracion.grupos.update');
Route::delete('/configuracion/grupos/{id}', [ConfiguracionController::class, 'destroyGrupo'])->name('configuracion.grupos.destroy');
Route::post('/configuracion/grupos/reorder', [ConfiguracionController::class, 'reorderGrupos'])->name('configuracion.grupos.reorder');

// Ruta de prueba para verificar conexión con Access
Route::get('/test-db', function () {
    try {
        $empleados = DB::table('empleados')->get();
        $casilleros = DB::table('casilleros')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Conexión exitosa a Access',
            'empleados_count' => $empleados->count(),
            'casilleros_count' => $casilleros->count(),
            'empleados' => $empleados,
            'casilleros' => $casilleros,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

// Auth routes (optional, can be removed if not needed)
require __DIR__ . '/auth.php';
