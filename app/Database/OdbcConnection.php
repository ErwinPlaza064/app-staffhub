<?php

namespace App\Database;

use Illuminate\Database\Connection;

class OdbcConnection extends Connection
{
    /**
     * Store the last inserted ID
     */
    protected $lastInsertId = null;

    /**
     * Get the default query grammar instance.
     *
     * @return \Illuminate\Database\Query\Grammars\Grammar
     */
    protected function getDefaultQueryGrammar()
    {
        return $this->withTablePrefix(new AccessGrammar);
    }

    /**
     * Get the default schema grammar instance.
     *
     * @return \Illuminate\Database\Schema\Grammars\Grammar|null
     */
    protected function getDefaultSchemaGrammar()
    {
        return null; // Access doesn't support schema operations well
    }

    /**
     * Get the default post processor instance.
     *
     * @return \Illuminate\Database\Query\Processors\Processor
     */
    protected function getDefaultPostProcessor()
    {
        return new \Illuminate\Database\Query\Processors\Processor;
    }

    /**
     * Get the last insert ID.
     * Override to avoid PDO lastInsertId() call which ODBC doesn't support.
     *
     * @param  string|null  $name
     * @return int
     */
    public function lastInsertId($name = null)
    {
        if ($this->lastInsertId !== null) {
            return $this->lastInsertId;
        }

        // Try @@IDENTITY
        try {
            $result = $this->getPdo()->query('SELECT @@IDENTITY AS id');
            if ($result) {
                $row = $result->fetch(\PDO::FETCH_OBJ);
                if ($row && $row->id) {
                    $this->lastInsertId = (int) $row->id;
                    return $this->lastInsertId;
                }
            }
        } catch (\Exception $e) {
            // Failed
        }

        return 0;
    }

    /**
     * Run an insert statement against the database.
     * Override to capture the last insert ID for Access.
     *
     * @param  string  $query
     * @param  array  $bindings
     * @return bool
     */
    public function insert($query, $bindings = [])
    {
        // Reset last insert ID
        $this->lastInsertId = null;

        // Execute the insert
        $result = parent::insert($query, $bindings);

        // Try to get the ID immediately after insert
        if ($result) {
            try {
                $idResult = $this->getPdo()->query('SELECT @@IDENTITY AS id');
                if ($idResult) {
                    $row = $idResult->fetch(\PDO::FETCH_OBJ);
                    if ($row && $row->id) {
                        $this->lastInsertId = (int) $row->id;
                    }
                }
            } catch (\Exception $e) {
                // Failed to get ID
            }
        }

        return $result;
    }
}
