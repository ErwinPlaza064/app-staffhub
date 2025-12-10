<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Area;
use App\Models\Grupo;
use App\Exports\EmpleadosExport;
use App\Imports\EmpleadosImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Empleado::activos();

        // Filtrar por área si se proporciona
        if ($request->has('area') && $request->area !== 'Todos') {
            $query->where('area', $request->area);
        }

        // Búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_nomina', 'like', "%{$search}%")
                    ->orWhere('nombre', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('grupo', 'like', "%{$search}%");
            });
        }

        $empleados = $query->orderBy('nombre')->get();

        // Obtener áreas y grupos desde la base de datos ordenados por el campo orden
        $areas = Area::orderBy('orden')->get();
        $grupos = Grupo::orderBy('orden')->get();

        // Obtener contadores por área (solo activos)
        $contadores = [
            'total' => Empleado::activos()->count(),
            'staff' => Empleado::activos()->where('area', 'Staff')->count(),
            'calidad' => Empleado::activos()->where('area', 'Calidad')->count(),
            'produccion' => Empleado::activos()->where('area', 'Producción')->count(),
            'almacen' => Empleado::activos()->where('area', 'Almacén')->count(),
            'mantenimiento' => Empleado::activos()->where('area', 'Mantenimiento')->count(),
            'bajas' => Empleado::bajas()->count(),
        ];

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
            'contadores' => $contadores,
            'areas' => $areas,
            'grupos' => $grupos,
            'filtros' => [
                'area' => $request->area ?? 'Todos',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Display a listing of employees that have been terminated.
     */
    public function bajasIndex(Request $request)
    {
        $query = Empleado::bajas();

        // Búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_nomina', 'like', "%{$search}%")
                    ->orWhere('nombre', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('motivo_baja', 'like', "%{$search}%");
            });
        }

        $bajas = $query->orderBy('fecha_baja', 'desc')->get();

        // Contadores para bajas
        $contadores = [
            'total' => Empleado::bajas()->count(),
            'staff' => Empleado::bajas()->where('area', 'Staff')->count(),
            'calidad' => Empleado::bajas()->where('area', 'Calidad')->count(),
            'produccion' => Empleado::bajas()->where('area', 'Producción')->count(),
            'almacen' => Empleado::bajas()->where('area', 'Almacén')->count(),
            'mantenimiento' => Empleado::bajas()->where('area', 'Mantenimiento')->count(),
        ];

        return Inertia::render('Bajas/Index', [
            'bajas' => $bajas,
            'contadores' => $contadores,
            'filtros' => [
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
            'numero_nomina' => [
                'required',
                'string',
                'size:5',
                'regex:/^[0-9]{5}$/',
                'unique:access.empleados,numero_nomina'
            ],
            'nombre' => 'required|string|min:3|max:255',
            'area' => 'required|in:Staff,Calidad,Producción,Almacén,Mantenimiento',
            'puesto' => 'required|string|min:3|max:100',
            'grupo' => 'required|in:A,B,C,MIXTO',
        ], [
            'numero_nomina.required' => 'El número de nómina es obligatorio',
            'numero_nomina.size' => 'El número de nómina debe tener exactamente 5 dígitos',
            'numero_nomina.regex' => 'El número de nómina solo debe contener dígitos',
            'numero_nomina.unique' => 'Este número de nómina ya está registrado',
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres',
            'area.required' => 'El área es obligatoria',
            'area.in' => 'El área seleccionada no es válida',
            'puesto.required' => 'El puesto es obligatorio',
            'puesto.min' => 'El puesto debe tener al menos 3 caracteres',
            'grupo.required' => 'El grupo es obligatorio',
            'grupo.in' => 'El grupo seleccionado no es válido',
        ]);

        // Usar DB::table para evitar el problema de lastInsertId() con ODBC
        \DB::connection('access')->table('empleados')->insert([
            'numero_nomina' => $validated['numero_nomina'],
            'nombre' => $validated['nombre'],
            'area' => $validated['area'],
            'puesto' => $validated['puesto'],
            'grupo' => $validated['grupo'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Empleado registrado exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $validated = $request->validate([
            'numero_nomina' => [
                'required',
                'string',
                'size:5',
                'regex:/^[0-9]{5}$/',
                'unique:access.empleados,numero_nomina,' . $id . ',Id'
            ],
            'nombre' => 'required|string|min:3|max:255',
            'area' => 'required|in:Staff,Calidad,Producción,Almacén,Mantenimiento',
            'puesto' => 'required|string|min:3|max:100',
            'grupo' => 'required|in:A,B,C,MIXTO',
        ], [
            'numero_nomina.required' => 'El número de nómina es obligatorio',
            'numero_nomina.size' => 'El número de nómina debe tener exactamente 5 dígitos',
            'numero_nomina.regex' => 'El número de nómina solo debe contener dígitos',
            'numero_nomina.unique' => 'Este número de nómina ya está registrado',
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres',
            'area.required' => 'El área es obligatoria',
            'area.in' => 'El área seleccionada no es válida',
            'puesto.required' => 'El puesto es obligatorio',
            'puesto.min' => 'El puesto debe tener al menos 3 caracteres',
            'grupo.required' => 'El grupo es obligatorio',
            'grupo.in' => 'El grupo seleccionado no es válido',
        ]);

        $validated['updated_at'] = now();

        $empleado->update($validated);

        return redirect()->back()->with('success', 'Empleado actualizado exitosamente.');
    }

    /**
     * Dar de baja a un empleado.
     */
    public function baja(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $validated = $request->validate([
            'motivo_baja' => 'required|string|max:255',
            'fecha_baja' => 'required|date',
        ]);

        // Liberar el casillero si tiene uno asignado
        if ($empleado->casillero) {
            $empleado->casillero->update([
                'empleado_id' => null,
                'estatus' => 'Disponible',
                'updated_at' => now(),
            ]);
        }

        $empleado->update([
            'fecha_baja' => $validated['fecha_baja'],
            'motivo_baja' => $validated['motivo_baja'],
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Empleado dado de baja exitosamente.');
    }

    /**
     * Reactivar un empleado dado de baja.
     */
    public function reactivar($id)
    {
        $empleado = Empleado::findOrFail($id);

        $empleado->update([
            'fecha_baja' => null,
            'motivo_baja' => null,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Empleado reactivado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);

        // Liberar el casillero si tiene uno asignado
        if ($empleado->casillero) {
            $empleado->casillero->update([
                'empleado_id' => null,
                'estatus' => 'Disponible',
                'updated_at' => now(),
            ]);
        }

        $empleado->delete();

        return redirect()->back()->with('success', 'Empleado eliminado exitosamente.');
    }

    /**
     * Get empleados data for API calls.
     */
    public function getData(Request $request)
    {
        $query = Empleado::query();

        if ($request->has('area') && $request->area !== 'Todos') {
            $query->where('area', $request->area);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_nomina', 'like', "%{$search}%")
                    ->orWhere('nombre', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'empleados' => $query->orderBy('nombre')->get(),
            'contadores' => [
                'total' => Empleado::count(),
                'staff' => Empleado::where('area', 'Staff')->count(),
                'calidad' => Empleado::where('area', 'Calidad')->count(),
                'produccion' => Empleado::where('area', 'Producción')->count(),
                'almacen' => Empleado::where('area', 'Almacén')->count(),
                'mantenimiento' => Empleado::where('area', 'Mantenimiento')->count(),
            ],
        ]);
    }

    /**
     * Exportar empleados a Excel
     */
    public function export()
    {
        return Excel::download(new EmpleadosExport, 'empleados_' . date('Y-m-d_His') . '.xlsx');
    }

    /**
     * Importar empleados desde Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:2048',
        ], [
            'file.required' => 'Debe seleccionar un archivo',
            'file.mimes' => 'El archivo debe ser de tipo Excel (.xlsx o .xls)',
            'file.max' => 'El archivo no debe superar los 2MB',
        ]);

        try {
            Excel::import(new EmpleadosImport, $request->file('file'));

            return redirect()->back()->with('success', 'Empleados importados exitosamente');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = "Fila {$failure->row()}: " . implode(', ', $failure->errors());
            }

            return redirect()->back()->withErrors(['import' => implode(' | ', $errors)]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['import' => 'Error al importar: ' . $e->getMessage()]);
        }
    }

    /**
     * Descargar plantilla de importación
     */
    public function downloadTemplate()
    {
        $headers = [
            'numero_de_nomina',
            'nombre_completo',
            'area',
            'puesto',
            'grupo',
        ];

        $exampleData = [
            ['09014', 'Juan Pérez García', 'Staff', 'Becario IT', 'A'],
            ['09015', 'María López Hernández', 'Calidad', 'Inspector', 'B'],
            ['09016', 'Carlos Martínez Ruiz', 'Producción', 'Operador', 'C'],
        ];

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Headers
        foreach ($headers as $index => $header) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, $header);
        }

        // Style headers
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '22408E'],
            ],
        ]);

        // Example data
        foreach ($exampleData as $rowIndex => $rowData) {
            foreach ($rowData as $colIndex => $value) {
                $sheet->setCellValueByColumnAndRow($colIndex + 1, $rowIndex + 2, $value);
            }
        }

        // Auto size columns
        foreach (range('A', 'E') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $fileName = 'plantilla_empleados.xlsx';

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit;
    }
}
