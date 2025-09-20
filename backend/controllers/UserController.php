<?php
$base_path = dirname(__DIR__);
include_once $base_path . '/config/database.php';
include_once $base_path . '/models/User.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($data->email) && !empty($data->password)) {
        
        $user->username = $data->username ?? '';
        $user->email = $data->email;
        $user->password = $data->password;
        $user->role = $data->role ?? 'user';
        
        // Verificar si el email ya existe
        if ($user->emailExists()) {
            http_response_code(409);
            echo json_encode(array("message" => "El email ya está registrado."));
            exit();
        }
        
        // Crear nuevo usuario
        if ($user->create()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Usuario creado exitosamente.",
                "user" => array(
                    "id" => $user->id,
                    "username" => $user->username,
                    "email" => $user->email,
                    "role" => $user->role
                )
            ));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al crear el usuario."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos. Email y password requeridos."));
    }
}
?>