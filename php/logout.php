<?php
require_once 'db.php';

$database = require 'db.php';
session_start();

if (isset($_SESSION['user_id'])) {
    // Actualizar la sesión con el tiempo de logout
    $database->update('user_sessions', [
        'logout_time' => date('Y-m-d H:i:s')
    ], [
        'id_user' => $_SESSION['user_id'],
        'logout_time' => null // Solo actualizar sesiones activas
    ]);

    // Destruir la sesión activa
    session_destroy();
}

header('Location: ../html/login.html'); // Redirige al login
exit;
?>
