<?php

namespace App\Services;

use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PDO;
use Throwable;

use function config;
use function Laravel\Prompts\error;
use function Laravel\Prompts\info;

class PgsqlVerificationService
{
    public static function verifyConnection(): void
    {
        Event::listen(CommandStarting::class, function (CommandStarting $event) {
            if (Str::startsWith($event->command, 'migrate')) {
                PgsqlVerificationService::ensureDatabaseAndSchemaExist();
            }
        });
    }

    /**
     * @throws \Throwable
     */
    public static function ensureDatabaseAndSchemaExist(): void
    {
        try {
            $connection = DB::connection();

            if ($connection->getDriverName() !== 'pgsql') {
                return;
            }

            $connection->getPdo();
        } catch (Throwable $exception) {
            if (Str::contains($exception->getMessage(), 'does not exist')) {
                PgsqlVerificationService::createDatabaseViaMaintenanceConnection();
            } else {
                throw $exception;
            }
        }

        PgsqlVerificationService::ensureMigrationSchema();
    }

    private static function createDatabaseViaMaintenanceConnection(): void
    {
        $config = config('database.connections.pgsql');
        $db_name = $config['database'];

        $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname=postgres";

        try {
            $pdo = new PDO($dsn, $config['username'], $config['password']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $stmt = $pdo->prepare('SELECT 1 FROM pg_database WHERE datname = ?');
            $stmt->execute([$db_name]);

            if (! $stmt->fetch()) {
                $pdo->exec("CREATE DATABASE \"$db_name\"");

                info("Database '$db_name' created successfully.");
            }
        } catch (Throwable $exception) {
            error("Could not auto-create database: {$exception->getMessage()}");
        }
    }

    private static function ensureMigrationSchema(): void
    {
        $migration_table = config('database.migrations.table', 'migrations');

        if (Str::contains($migration_table, '.')) {
            $schema = Str::before($migration_table, '.');

            DB::statement("CREATE SCHEMA IF NOT EXISTS $schema");
        }
    }
}
