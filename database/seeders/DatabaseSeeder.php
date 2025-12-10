<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeders
        $this->call([
            ConfiguracionSeeder::class,  // Primero áreas y grupos
            CasilleroSeeder::class,      // Luego casilleros
        ]);

        $this->command->info('🎉 Todos los seeders ejecutados exitosamente!');
    }
}
