<?php

namespace App\Providers;

use App\Database\OdbcConnection;
use App\Database\OdbcConnector;
use Illuminate\Database\Connection;
use Illuminate\Support\ServiceProvider;

class OdbcServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        Connection::resolverFor('odbc', function ($connection, $database, $prefix, $config) {
            $connector = new OdbcConnector();
            $pdo = $connector->connect($config);

            return new OdbcConnection($pdo, $database, $prefix, $config);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
