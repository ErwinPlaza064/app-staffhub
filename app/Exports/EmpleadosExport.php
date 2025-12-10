<?php

namespace App\Exports;

use App\Models\Empleado;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmpleadosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Empleado::activos()->orderBy('nombre')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Número de Nómina',
            'Nombre Completo',
            'Área',
            'Puesto',
            'Grupo',
            'Fecha de Alta',
        ];
    }

    /**
     * @param mixed $empleado
     * @return array
     */
    public function map($empleado): array
    {
        return [
            $empleado->numero_nomina,
            $empleado->nombre,
            $empleado->area,
            $empleado->puesto,
            $empleado->grupo,
            $empleado->created_at ? $empleado->created_at->format('d/m/Y') : '',
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as header
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '22408E'] // Logo color
                ],
            ],
        ];
    }
}
