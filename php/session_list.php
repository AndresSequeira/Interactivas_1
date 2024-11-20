<?php
require_once 'db.php';

$database = require 'db.php';

// Obtener todas las sesiones
$sessions = $database->select('user_sessions', [
    '[>]tb_users' => ['id_user' => 'id_users']
], [
    'tb_users.name',
    'user_sessions.login_time',
    'user_sessions.logout_time'
]);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Sesiones</title>
</head>
<body>
    <h1>Sesiones de Usuarios</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Usuario</th>
                <th>Inicio de Sesión</th>
                <th>Fin de Sesión</th>
                <th>Duración</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($sessions as $session): ?>
                <tr>
                    <td><?= htmlspecialchars($session['name']) ?></td>
                    <td><?= htmlspecialchars($session['login_time']) ?></td>
                    <td><?= htmlspecialchars($session['logout_time'] ?? 'Sesión activa') ?></td>
                    <td>
                        <?php
                        if ($session['logout_time']) {
                            $start = new DateTime($session['login_time']);
                            $end = new DateTime($session['logout_time']);
                            $interval = $start->diff($end);
                            echo $interval->format('%H:%I:%S');
                        } else {
                            echo 'N/A';
                        }
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
