<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejo de preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener la URL desde el parámetro de reescritura
$url = isset($_GET['url']) ? $_GET['url'] : '';
$url = rtrim($url, '/');
$url_parts = explode('/', $url);

$endpoint = $url_parts[0] ?? '';
$param1 = $url_parts[1] ?? '';
$param2 = $url_parts[2] ?? '';

$method = $_SERVER['REQUEST_METHOD'];

// Enrutamiento para GET - permitir pruebas desde navegador
switch (true) {
    case $endpoint == 'auth' && $param1 == 'login':
        if ($method == 'GET') {
            // Mensaje informativo para login
            http_response_code(200);
            echo json_encode(array(
                "message" => "Endpoint de login - Use POST para autenticar",
                "example_post_request" => array(
                    "email" => "usuario@ejemplo.com",
                    "password" => "password123"
                )
            ));
        } else {
            include 'controllers/AuthController.php';
        }
        break;
        
    case $endpoint == 'accommodations' && empty($param1):
        include 'controllers/AccommodationController.php';
        break;
        
    case $endpoint == 'accommodations' && is_numeric($param1) && empty($param2):
        $_GET['id'] = $param1;
        include 'controllers/AccommodationController.php';
        break;
        
    case $endpoint == 'favorites' && $param1 == 'user' && is_numeric($param2):
        $_GET['user_id'] = $param2;
        include 'controllers/FavoriteController.php';
        break;
        
    case empty($endpoint):
        // Página principal - mostrar información de la API
        http_response_code(200);
        echo json_encode(array(
            "message" => "API de Alojamientos App",
            "endpoints_get" => array(
                "GET /" => "Información de la API (este mensaje)",
                "GET /accommodations" => "Obtener todos los alojamientos",
                "GET /accommodations/{id}" => "Obtener un alojamiento específico",
                "GET /favorites/user/{id}" => "Obtener favoritos de un usuario"
            ),
            "endpoints_post" => array(
                "POST /auth/login" => "Autenticación de usuarios",
                "POST /accommodations" => "Crear un nuevo alojamiento",
                "POST /favorites" => "Agregar a favoritos"
            ),
            "endpoints_other" => array(
                "PUT /accommodations" => "Actualizar un alojamiento",
                "DELETE /accommodations" => "Eliminar un alojamiento",
                "DELETE /favorites" => "Eliminar de favoritos"
            )
        ));
        break;
        
    default:
        http_response_code(404);
        echo json_encode(array(
            "message" => "Endpoint no encontrado.",
            "requested_url" => $url,
            "available_get_endpoints" => array(
                "GET /",
                "GET /accommodations",
                "GET /accommodations/{id}",
                "GET /favorites/user/{id}"
            )
        ));
        break;
}
?>