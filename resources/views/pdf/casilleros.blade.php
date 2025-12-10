<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Casilleros Ocupados</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
        }

        .header {
            background-color: #22408e;
            color: white;
            padding: 30px 40px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-content {
            flex: 1;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 12px;
            opacity: 0.9;
        }

        .logo {
            width: 180px;
            height: auto;
        }

        .container {
            padding: 0 40px 40px;
        }

        .info-section {
            background-color: #f8f9fa;
            border-left: 4px solid #22408e;
            padding: 15px 20px;
            margin-bottom: 25px;
        }

        .info-section h3 {
            color: #22408e;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .info-item {
            font-size: 12px;
        }

        .info-label {
            font-weight: bold;
            color: #666;
        }

        .info-value {
            color: #333;
            font-size: 16px;
            margin-top: 2px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
        }

        thead {
            background-color: #22408e;
            color: white;
        }

        thead th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tbody tr {
            border-bottom: 1px solid #e0e0e0;
        }

        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        tbody tr:hover {
            background-color: #e8f0fe;
        }

        tbody td {
            padding: 10px;
            color: #555;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-hombres {
            background-color: #e3f2fd;
            color: #1976d2;
        }

        .badge-mujeres {
            background-color: #fce4ec;
            color: #c2185b;
        }

        .numero-casillero {
            font-weight: bold;
            color: #22408e;
            font-size: 12px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #22408e;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        .page-number {
            position: fixed;
            bottom: 20px;
            right: 40px;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <h1>Reporte de Casilleros Ocupados</h1>
            <p>Fecha de generación: {{ date('d/m/Y H:i') }}</p>
        </div>
        <img src="{{ public_path('images/logo.svg') }}" alt="Logo" class="logo">
    </div>

    <!-- Container -->
    <div class="container">
        <!-- Info Section -->
        <div class="info-section">
            <h3>Resumen General</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Total Ocupados</div>
                    <div class="info-value">{{ $casilleros->count() }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Hombres</div>
                    <div class="info-value">{{ $casilleros->where('tipo', 'Hombres')->count() }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Mujeres</div>
                    <div class="info-value">{{ $casilleros->where('tipo', 'Mujeres')->count() }}</div>
                </div>
            </div>
        </div>

        <!-- Table -->
        <table>
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Número de Nómina</th>
                    <th>Nombre del Empleado</th>
                    <th>Fecha de Asignación</th>
                </tr>
            </thead>
            <tbody>
                @forelse($casilleros as $casillero)
                    <tr>
                        <td class="numero-casillero">{{ $casillero->numero_casillero }}</td>
                        <td>
                            <span
                                class="badge {{ $casillero->tipo === 'Hombres' ? 'badge-hombres' : 'badge-mujeres' }}">
                                {{ $casillero->tipo }}
                            </span>
                        </td>
                        <td>{{ $casillero->empleado->numero_nomina ?? 'N/A' }}</td>
                        <td>{{ $casillero->empleado->nombre ?? 'Sin asignar' }}</td>
                        <td>{{ $casillero->updated_at ? $casillero->updated_at->format('d/m/Y') : 'N/A' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 20px; color: #999;">
                            No hay casilleros ocupados
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p>Este reporte fue generado automáticamente por el Sistema StaffHub</p>
            <p>© {{ date('Y') }} - Todos los derechos reservados</p>
        </div>
    </div>

    <!-- Page Number -->
    <div class="page-number">
        <script type="text/php">
            if (isset($pdf)) {
                $text = "Página {PAGE_NUM} de {PAGE_COUNT}";
                $size = 10;
                $font = $fontMetrics->getFont("Arial");
                $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
                $x = ($pdf->get_width() - $width) / 2;
                $y = $pdf->get_height() - 35;
                $pdf->page_text($x, $y, $text, $font, $size);
            }
        </script>
    </div>
</body>

</html>
