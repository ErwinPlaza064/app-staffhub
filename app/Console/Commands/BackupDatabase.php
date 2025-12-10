<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup 
                            {--keep=7 : Number of days to keep backups}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a backup of the Access database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando backup de la base de datos...');

        // Obtener ruta de la base de datos desde config
        $dbPath = config('database.connections.access.database');

        if (!file_exists($dbPath)) {
            $this->error('No se encontró el archivo de base de datos en: ' . $dbPath);
            return 1;
        }

        // Crear directorio de backups si no existe
        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        // Nombre del archivo de backup
        $timestamp = Carbon::now()->format('Y-m-d_His');
        $backupFile = $backupDir . '/staff hub_backup_' . $timestamp . '.accdb';

        // Copiar el archivo
        try {
            File::copy($dbPath, $backupFile);
            $this->info('✓ Backup creado exitosamente: ' . basename($backupFile));

            // Mostrar tamaño del archivo
            $fileSize = File::size($backupFile);
            $this->info('  Tamaño: ' . $this->formatBytes($fileSize));

            // Limpiar backups antiguos
            $this->cleanOldBackups($backupDir, $this->option('keep'));

            return 0;
        } catch (\Exception $e) {
            $this->error('Error al crear el backup: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Limpiar backups antiguos
     */
    protected function cleanOldBackups(string $backupDir, int $daysToKeep)
    {
        $this->info("\nLimpiando backups antiguos (conservando últimos {$daysToKeep} días)...");

        $files = File::files($backupDir);
        $cutoffDate = Carbon::now()->subDays($daysToKeep);
        $deletedCount = 0;

        foreach ($files as $file) {
            $fileDate = Carbon::createFromTimestamp(File::lastModified($file));

            if ($fileDate->lt($cutoffDate)) {
                File::delete($file);
                $deletedCount++;
                $this->line('  - Eliminado: ' . $file->getFilename());
            }
        }

        if ($deletedCount > 0) {
            $this->info("✓ {$deletedCount} backup(s) antiguo(s) eliminado(s)");
        } else {
            $this->info('✓ No hay backups antiguos para eliminar');
        }
    }

    /**
     * Format bytes to human readable
     */
    protected function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
