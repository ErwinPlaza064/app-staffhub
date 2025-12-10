<?php

namespace App\Http\Controllers;

use App\Models\Casillero;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class CasilleroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Casillero::with('empleado');

        // Filtrar por tipo si se proporciona
        if ($request->has('tipo') && $request->tipo !== 'Todos') {
            $query->where('tipo', $request->tipo);
        }

        // Filtrar por estatus si se proporciona
        if ($request->has('estatus') && $request->estatus !== 'Todos') {
            $query->where('estatus', $request->estatus);
        }

        // Búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_casillero', 'like', "%{$search}%")
                    ->orWhere('estatus', 'like', "%{$search}%")
                    ->orWhereHas('empleado', function ($q2) use ($search) {
                        $q2->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        $casilleros = $query->orderBy('numero_casillero')->get();

        // Separar por género
        $casillerosHombres = $casilleros->where('tipo', 'Hombres')->values();
        $casillerosMujeres = $casilleros->where('tipo', 'Mujeres')->values();

        // Obtener contadores
        $contadores = [
            'total' => Casillero::count(),
            'ocupados' => Casillero::where('estatus', 'Ocupado')->count(),
            'disponibles' => Casillero::where('estatus', 'Disponible')->count(),
            'mantenimiento' => Casillero::where('estatus', 'Mantenimiento')->count(),
            'hombres' => [
                'total' => Casillero::where('tipo', 'Hombres')->count(),
                'ocupados' => Casillero::where('tipo', 'Hombres')->where('estatus', 'Ocupado')->count(),
                'disponibles' => Casillero::where('tipo', 'Hombres')->where('estatus', 'Disponible')->count(),
            ],
            'mujeres' => [
                'total' => Casillero::where('tipo', 'Mujeres')->count(),
                'ocupados' => Casillero::where('tipo', 'Mujeres')->where('estatus', 'Ocupado')->count(),
                'disponibles' => Casillero::where('tipo', 'Mujeres')->where('estatus', 'Disponible')->count(),
            ],
        ];

        // Obtener empleados sin casillero para asignación
        $empleadosSinCasillero = Empleado::whereDoesntHave('casillero')->orderBy('nombre')->get();

        return Inertia::render('Casilleros/Index', [
            'casillerosHombres' => $casillerosHombres,
            'casillerosMujeres' => $casillerosMujeres,
            'contadores' => $contadores,
            'empleadosSinCasillero' => $empleadosSinCasillero,
            'filtros' => [
                'tipo' => $request->tipo ?? 'Todos',
                'estatus' => $request->estatus ?? 'Todos',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_casillero' => [
                'required',
                'string',
                'size:3',
                'regex:/^[0-9]{3}$/',
            ],
            'tipo' => 'required|in:Hombres,Mujeres',
            'emp_id' => 'nullable|exists:access.empleados,Id',
        ], [
            'numero_casillero.required' => 'El número de casillero es obligatorio',
            'numero_casillero.size' => 'El número de casillero debe tener exactamente 3 dígitos (ej: 001)',
            'numero_casillero.regex' => 'El número de casillero solo debe contener dígitos',
            'tipo.required' => 'El tipo de casillero es obligatorio',
            'tipo.in' => 'El tipo de casillero debe ser Hombres o Mujeres',
        ]);

        // Verificar que el número de casillero sea único dentro del mismo tipo
        $count = Casillero::where('numero_casillero', $validated['numero_casillero'])
            ->where('tipo', $validated['tipo'])
            ->count();

        if ($count > 0) {
            return redirect()->back()->withErrors([
                'numero_casillero' => 'Este número de casillero ya existe para ' . $validated['tipo'] . '.'
            ])->withInput();
        }

        // Determinar estatus basado en si hay empleado asignado
        $estatus = !empty($validated['emp_id']) ? 'Ocupado' : 'Disponible';

        // Usar DB::table para evitar el problema de lastInsertId() con ODBC
        \DB::connection('access')->table('casilleros')->insert([
            'numero_casillero' => $validated['numero_casillero'],
            'tipo' => $validated['tipo'],
            'emp_id' => $validated['emp_id'] ?: null,
            'estatus' => $estatus,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Casillero registrado exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $casillero = Casillero::findOrFail($id);

        $validated = $request->validate([
            'numero_casillero' => 'required|string|max:20',
            'tipo' => 'required|in:Hombres,Mujeres',
            'emp_id' => 'nullable|exists:access.empleados,Id',
            'estatus' => 'required|in:Disponible,Ocupado,Mantenimiento',
        ]);

        // Verificar que el número de casillero sea único dentro del mismo tipo (excluyendo el actual)
        $count = Casillero::where('numero_casillero', $validated['numero_casillero'])
            ->where('tipo', $validated['tipo'])
            ->where('Id', '!=', $id)
            ->count();

        if ($count > 0) {
            return redirect()->back()->withErrors([
                'numero_casillero' => 'Este número de locker ya existe para ' . $validated['tipo'] . '.'
            ])->withInput();
        }

        // Si se asigna un empleado, el estatus debe ser Ocupado
        if (!empty($validated['emp_id'])) {
            $validated['estatus'] = 'Ocupado';
        } elseif ($validated['estatus'] === 'Ocupado') {
            // Si no hay empleado pero el estatus es Ocupado, cambiar a Disponible
            $validated['estatus'] = 'Disponible';
        }

        $validated['updated_at'] = now();

        $casillero->update($validated);

        return redirect()->back()->with('success', 'Casillero actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $casillero = Casillero::findOrFail($id);
        $casillero->delete();

        return redirect()->back()->with('success', 'Casillero eliminado exitosamente.');
    }

    /**
     * Assign an employee to a locker.
     */
    public function asignar(Request $request, $id)
    {
        $casillero = Casillero::findOrFail($id);

        $validated = $request->validate([
            'emp_id' => 'required|exists:access.empleados,Id',
        ]);

        // Usar DB::table para actualizar directamente en Access
        \DB::connection('access')->table('casilleros')
            ->where('Id', $id)
            ->update([
                'emp_id' => (int) $validated['emp_id'],
                'estatus' => 'Ocupado',
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'Casillero asignado exitosamente.');
    }

    /**
     * Release a locker from an employee.
     */
    public function liberar($id)
    {
        // Usar DB::table para actualizar directamente en Access
        \DB::connection('access')->table('casilleros')
            ->where('Id', $id)
            ->update([
                'emp_id' => null,
                'estatus' => 'Disponible',
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'Casillero liberado exitosamente.');
    }

    /**
     * Get casilleros data for API calls.
     */
    public function getData(Request $request)
    {
        $casilleros = Casillero::with('empleado')->orderBy('numero_casillero')->get();

        return response()->json([
            'casillerosHombres' => $casilleros->where('tipo', 'Hombres')->values(),
            'casillerosMujeres' => $casilleros->where('tipo', 'Mujeres')->values(),
            'contadores' => [
                'total' => Casillero::count(),
                'ocupados' => Casillero::where('estatus', 'Ocupado')->count(),
                'disponibles' => Casillero::where('estatus', 'Disponible')->count(),
                'hombres' => [
                    'total' => Casillero::where('tipo', 'Hombres')->count(),
                    'ocupados' => Casillero::where('tipo', 'Hombres')->where('estatus', 'Ocupado')->count(),
                    'disponibles' => Casillero::where('tipo', 'Hombres')->where('estatus', 'Disponible')->count(),
                ],
                'mujeres' => [
                    'total' => Casillero::where('tipo', 'Mujeres')->count(),
                    'ocupados' => Casillero::where('tipo', 'Mujeres')->where('estatus', 'Ocupado')->count(),
                    'disponibles' => Casillero::where('tipo', 'Mujeres')->where('estatus', 'Disponible')->count(),
                ],
            ],
        ]);
    }

    /**
     * Exportar casilleros ocupados a PDF
     */
    public function exportPdf()
    {
        // Solo casilleros ocupados (con empleado asignado)
        $casilleros = Casillero::with('empleado')
            ->where('estatus', 'Ocupado')
            ->whereNotNull('emp_id')
            ->orderBy('tipo')
            ->orderBy('numero_casillero')
            ->get();

        $pdf = Pdf::loadView('pdf.casilleros', compact('casilleros'));
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('casilleros_ocupados_' . date('Y-m-d_His') . '.pdf');
    }
}
