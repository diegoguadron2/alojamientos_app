<?php
// Configurar las rutas correctamente
$base_path = dirname(__DIR__);
include_once $base_path . '/config/database.php';
include_once $base_path . '/models/Accommodation.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();

$accommodation = new Accommodation($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $accommodation->id = $_GET['id'];
            if($accommodation->readOne()) {
                http_response_code(200);
                echo json_encode(array(
                    "id" => $accommodation->id,
                    "title" => $accommodation->title,
                    "description" => $accommodation->description,
                    "image_url" => $accommodation->image_url,
                    "price_per_night" => $accommodation->price_per_night,
                    "created_at" => $accommodation->created_at,
                    "user_id" => $accommodation->user_id
                ));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Alojamiento no encontrado."));
            }
        } else {
            $stmt = $accommodation->read();
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $accommodations_arr = array();
                $accommodations_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $accommodation_item = array(
                        "id" => $id,
                        "title" => $title,
                        "description" => $description,
                        "image_url" => $image_url,
                        "price_per_night" => $price_per_night,
                        "created_at" => $created_at,
                        "user_id" => $user_id,
                        "owner" => $owner
                    );
                    array_push($accommodations_arr["records"], $accommodation_item);
                }
                
                http_response_code(200);
                echo json_encode($accommodations_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron alojamientos."));
            }
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->title) && !empty($data->price_per_night) && !empty($data->user_id)) {
            $accommodation->title = $data->title;
            $accommodation->description = $data->description;
            $accommodation->image_url = $data->image_url;
            $accommodation->price_per_night = $data->price_per_night;
            $accommodation->user_id = $data->user_id;
            
            if($accommodation->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Alojamiento creado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el alojamiento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el alojamiento. Datos incompletos."));
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $accommodation->id = $data->id;
        $accommodation->title = $data->title;
        $accommodation->description = $data->description;
        $accommodation->image_url = $data->image_url;
        $accommodation->price_per_night = $data->price_per_night;
        
        if($accommodation->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Alojamiento actualizado correctamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo actualizar el alojamiento."));
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $accommodation->id = $data->id;
        
        if($accommodation->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Alojamiento eliminado correctamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo eliminar el alojamiento."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>