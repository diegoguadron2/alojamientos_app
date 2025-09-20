<?php
$base_path = dirname(__DIR__);
include_once $base_path . '/config/database.php';
include_once $base_path . '/models/Favorite.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();

$favorite = new Favorite($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['user_id'])) {
            $favorite->user_id = $_GET['user_id'];
            $stmt = $favorite->readByUser();
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $favorites_arr = array(); // ← Array directo, sin propiedad "records"
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $favorite_item = array(
                        "id" => $id,
                        "user_id" => $user_id,
                        "accommodation_id" => $accommodation_id,
                        "title" => $title,
                        "image_url" => $image_url,
                        "price_per_night" => $price_per_night,
                        "created_at" => $created_at
                    );
                    array_push($favorites_arr, $favorite_item); // ← Push directo al array
                }
                
                http_response_code(200);
                echo json_encode($favorites_arr); // ← Devuelve [...]
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron favoritos."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Se requiere user_id."));
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->user_id) && !empty($data->accommodation_id)) {
            $favorite->user_id = $data->user_id;
            $favorite->accommodation_id = $data->accommodation_id;
            
            if($favorite->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Alojamiento agregado a favoritos."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo agregar a favoritos. Puede que ya exista."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo agregar a favoritos. Datos incompletos."));
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->user_id) && !empty($data->accommodation_id)) {
            $favorite->user_id = $data->user_id;
            $favorite->accommodation_id = $data->accommodation_id;
            
            if($favorite->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Alojamiento eliminado de favoritos."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar de favoritos."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo eliminar de favoritos. Datos incompletos."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>