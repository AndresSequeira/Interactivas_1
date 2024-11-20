<?php
require_once 'db.php'; // Conexión a la base de datos

$database = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$name || !$password) {
        echo 'Por favor, completa todos los campos.';
        exit;
    }

    $user = $database->get('tb_users', ['id_users', 'password'], ['name' => $name]);

    if (!$user || !password_verify($password, $user['password'])) {
        echo 'Usuario o contraseña incorrectos.';
        exit;
    }

    // Iniciar sesión
    session_start();
    $_SESSION['user_id'] = $user['id_users'];
    $_SESSION['user_name'] = $name;

    // Registrar el inicio de sesión en la base de datos
    $database->insert('user_sessions', [
        'id_user' => $user['id_users'],
        'login_time' => date('Y-m-d H:i:s')
    ]);

    echo 'Inicio de sesión exitoso.';
    header('Location: login.html');
    exit;
}
?>
