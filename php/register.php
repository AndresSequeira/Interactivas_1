<?php
require_once 'db.php'; // Cargar la conexión a la base de datos

$database = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? null;
    $password = $_POST['password'] ?? null;

    // Validar campos vacíos
    if (!$name || !$password) {
        echo 'Todos los campos son obligatorios.';
        exit;
    }

    // Verificar si el usuario ya existe
    $userExists = $database->has('tb_users', ['name' => $name]);

    if ($userExists) {
        echo 'El nombre de usuario ya está en uso.';
        exit;
    }

    // Hashear la contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insertar el nuevo usuario en la base de datos
    $database->insert('tb_users', [
        'name' => $name,
        'password' => $passwordHash,
    ]);

    if ($database->id()) {
        echo 'Usuario registrado exitosamente.';
        header('Location: login.html');
    } else {
        echo 'Hubo un error al registrar el usuario.';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
</head>
<body>
    <h1>Registro de Usuario</h1>
    <form action="register.php" method="POST">
        <label for="name">Nombre de usuario:</label><br>
        <input type="text" id="name" name="name" required><br><br>

        <label for="password">Contraseña:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit">Registrarse</button>
    </form>
</body>
</html>
