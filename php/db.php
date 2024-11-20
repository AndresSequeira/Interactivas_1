<?php 
    namespace Medoo;
    require 'Medoo.php';

    if(!isset($database)){
        $database = new Medoo([
            'type'=>'mysql', 
            'host' => 'localhost', 
            'database' => 'proyecto',
            'username' => 'root',
            'password' => ''
        ]);
    }
?>