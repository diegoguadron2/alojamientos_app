<?php
class Accommodation {
    private $conn;
    private $table_name = "accommodations";

    public $id;
    public $title;
    public $description;
    public $image_url;
    public $price_per_night;
    public $created_at;
    public $user_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT a.*, u.username as owner 
                  FROM " . $this->table_name . " a 
                  LEFT JOIN users u ON a.user_id = u.id 
                  ORDER BY a.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT a.*, u.username as owner 
                  FROM " . $this->table_name . " a 
                  LEFT JOIN users u ON a.user_id = u.id 
                  WHERE a.id = ? 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->image_url = $row['image_url'];
            $this->price_per_night = $row['price_per_night'];
            $this->created_at = $row['created_at'];
            $this->user_id = $row['user_id'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET title=:title, description=:description, image_url=:image_url, 
                  price_per_night=:price_per_night, user_id=:user_id";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->price_per_night = htmlspecialchars(strip_tags($this->price_per_night));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":price_per_night", $this->price_per_night);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET title=:title, description=:description, image_url=:image_url, 
                  price_per_night=:price_per_night
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->price_per_night = htmlspecialchars(strip_tags($this->price_per_night));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":price_per_night", $this->price_per_night);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>