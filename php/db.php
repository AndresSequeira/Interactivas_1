<?php
require_once 'Medoo.php';

use Medoo\Medoo;

$database = new Medoo([
    'type' => 'mysql',
    'host' => 'localhost',
    'database' => 'proyecto',
    'username' => 'root',
    'password' => ''
]);

return $database; // IMPORTANTE: Esto asegura que devuelva la instancia
?>
