<?php

namespace App\Database;

use Illuminate\Database\Query\Grammars\Grammar;

class AccessGrammar extends Grammar
{
    /**
     * Compile a select query into SQL.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return string
     */
    public function compileSelect($query)
    {
        // If the query has a limit, we need to apply TOP clause
        if (! is_null($query->limit) && is_null($query->offset)) {
            return $this->compileSelectWithTop($query);
        }

        // Remove limit for offset queries (Access doesn't support OFFSET well)
        $original = $query->limit;
        $query->limit = null;

        $sql = parent::compileSelect($query);

        // Remove any LIMIT clause that might have been added
        $sql = preg_replace('/\s+limit\s+\d+/i', '', $sql);

        $query->limit = $original;

        return $sql;
    }

    /**
     * Compile a select query with TOP clause for Access.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return string
     */
    protected function compileSelectWithTop($query)
    {
        $limit = $query->limit;
        $query->limit = null;

        $sql = parent::compileSelect($query);

        // Remove any LIMIT clause
        $sql = preg_replace('/\s+limit\s+\d+/i', '', $sql);

        // Replace SELECT with SELECT TOP n
        $sql = preg_replace('/^select/i', "SELECT TOP $limit", $sql);

        $query->limit = $limit;

        return $sql;
    }

    /**
     * Compile a truncate table statement into SQL.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return array
     */
    public function compileTruncate($query)
    {
        return ['delete from ' . $this->wrapTable($query->from) => []];
    }

    /**
     * Wrap a single string in keyword identifiers.
     *
     * @param  string  $value
     * @return string
     */
    protected function wrapValue($value)
    {
        if ($value === '*') {
            return $value;
        }

        // Access uses square brackets for identifiers
        return '[' . str_replace(']', ']]', $value) . ']';
    }
}
