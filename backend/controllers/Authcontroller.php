<?php
$base_path = dirname(__DIR__);
include_once $base_path . '/config/database.php';
include_once $base_path . '/models/User.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $email_exists = $user->emailExists();
    
    if($email_exists && password_verify($data->password, $user->password)) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Login exitoso.",
            "user" => array(
                "id" => $user->id,
                "username" => $user->username,
                "email" => $user->email,
                "role" => $user->role
            )
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Login fallido."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "No se puede realizar el login. Datos incompletos."));
}
?>