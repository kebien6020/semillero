<?php

use \Illuminate\Support\HtmlString;

// Like ucfirst but works with uppercase words
function ufirst($str){
    return ucfirst(strtolower($str));
}

// Rendering rows from a table like this
// [
//   ['display' => 'Title', 'name' => 'key'],
//   ['display' => 'Other title', 'name' => 'key_two', 'decimals' => 2],
// ]
// and a model like this 
// (object)[
//   ['key' => 'Hello'],
//   ['key_two' => 5.3256]
// ]
// Into a couple of html tr with two td each
function render_rows($rows, $model)
{
    $res = '';
    foreach ($rows as $row)
    {
        // For using -> syntax
        $row = (object) $row;

        // Complex curly syntax
        // See the docs: http://php.net/manual/en/language.types.string.php#language.types.string.parsing.complex
        $val = $model->{$row->name};

        // Skip row if val is null
        if (is_null($val)) continue;

        // Skip row if the cond specified for the $row is false in the $model
        if (isset($row->cond) && !$model->{$row->cond}) continue;

        // Round if specified
        if(isset($row->decimals))
            $val = round($val, $row->decimals);

        // Escape values
        $display = e($row->display);
        $val = e($val);

        // Add row
        $res .= "<tr>
            <td>{$row->display}</td>
            <td>{$val}</td>
        </tr>";
    }
    // HtmlString is not escaped by blade {{ $var }}
    return new HtmlString($res);
}