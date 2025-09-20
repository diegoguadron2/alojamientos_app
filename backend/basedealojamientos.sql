CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL, 
    `role` ENUM('admin', 'user') DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
);

CREATE TABLE `accommodations` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image_url` VARCHAR(255),
    `price_per_night` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `user_id` INT NOT NULL,  
    PRIMARY KEY(`id`)
);

CREATE TABLE `user_favorites` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,  
    `accommodation_id` INT NOT NULL,  
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY `unique_user_accommodation` (`user_id`, `accommodation_id`)  
);

ALTER TABLE `accommodations`
ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;  

ALTER TABLE `user_favorites`
ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_favorites`  
ADD FOREIGN KEY (`accommodation_id`) REFERENCES `accommodations`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;