<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CasilleroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla antes de insertar
        DB::connection('access')->table('casilleros')->delete();

        $this->command->info('🗑️  Casilleros anteriores eliminados');
        $this->command->info('Creando casilleros...');
        $count = 0;

        // Crear 110 casilleros para Hombres (001-110)
        for ($i = 1; $i <= 110; $i++) {
            DB::connection('access')->table('casilleros')->insert([
                'numero_casillero' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'tipo' => 'Hombres',
                'estatus' => 'Disponible',
                'emp_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $count++;

            if ($count % 20 == 0) {
                $this->command->info("   - Creados {$count} casilleros...");
            }
        }

        // Crear 55 casilleros para Mujeres (001-055)
        for ($i = 1; $i <= 55; $i++) {
            DB::connection('access')->table('casilleros')->insert([
                'numero_casillero' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'tipo' => 'Mujeres',
                'estatus' => 'Disponible',
                'emp_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $count++;

            if ($count % 20 == 0) {
                $this->command->info("   - Creados {$count} casilleros...");
            }
        }

        $this->command->info('');
        $this->command->info('✅ Casilleros creados exitosamente:');
        $this->command->info('   - 110 casilleros para Hombres (001-110)');
        $this->command->info('   - 55 casilleros para Mujeres (001-055)');
        $this->command->info('   - Total: 165 casilleros');
    }
}
