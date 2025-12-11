<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Insertando áreas y grupos...');

        // Limpiar tablas
        DB::connection('access')->table('areas')->delete();
        DB::connection('access')->table('grupos')->delete();

        // Insertar Áreas
        $areas = [
            ['nombre' => 'Staff', 'descripcion' => 'Personal de oficina y administrativo', 'orden' => 1],
            ['nombre' => 'Calidad', 'descripcion' => 'Control de calidad', 'orden' => 2],
            ['nombre' => 'Producción', 'descripcion' => 'Área de producción', 'orden' => 3],
            ['nombre' => 'Almacén', 'descripcion' => 'Almacén y logística', 'orden' => 4],
            ['nombre' => 'Mantenimiento', 'descripcion' => 'Mantenimiento de instalaciones', 'orden' => 5],
        ];

        foreach ($areas as $area) {
            DB::connection('access')->table('areas')->insert([
                'nombre' => $area['nombre'],
                'descripcion' => $area['descripcion'],
                'orden' => $area['orden'],
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('   ✅ 5 áreas insertadas');

        // Insertar Grupos
        $grupos = [
            ['nombre' => 'A', 'descripcion' => 'Grupo A', 'orden' => 1],
            ['nombre' => 'B', 'descripcion' => 'Grupo B', 'orden' => 2],
            ['nombre' => 'MIXTO', 'descripcion' => 'Grupo mixto', 'orden' => 4],
        ];

        foreach ($grupos as $grupo) {
            DB::connection('access')->table('grupos')->insert([
                'nombre' => $grupo['nombre'],
                'descripcion' => $grupo['descripcion'],
                'orden' => $grupo['orden'],
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('   ✅ 3 grupos insertados');
        $this->command->info('');
        $this->command->info('✅ Configuración inicial completada');
    }
}
