<?php
class Favorite {
    private $conn;
    private $table_name = "user_favorites";

    public $id;
    public $user_id;
    public $accommodation_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readByUser() {
        $query = "SELECT f.*, a.title, a.image_url, a.price_per_night 
                  FROM " . $this->table_name . " f
                  JOIN accommodations a ON f.accommodation_id = a.id
                  WHERE f.user_id = ?
                  ORDER BY f.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }

    public function exists() {
        $query = "SELECT id
                  FROM " . $this->table_name . "
                  WHERE user_id = ? AND accommodation_id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->accommodation_id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public function create() {
        if($this->exists()) {
            return false; // Ya existe este favorito
        }

        $query = "INSERT INTO " . $this->table_name . "
                  SET user_id=:user_id, accommodation_id=:accommodation_id";

        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->accommodation_id = htmlspecialchars(strip_tags($this->accommodation_id));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":accommodation_id", $this->accommodation_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE user_id = ? AND accommodation_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->accommodation_id = htmlspecialchars(strip_tags($this->accommodation_id));
        
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->accommodation_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>