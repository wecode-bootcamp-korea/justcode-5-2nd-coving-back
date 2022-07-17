CREATE TABLE `program` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL UNIQUE,
  `poster_img_url` varchar(2000) NOT NULL,
  `title_img_url` varchar(2000) NOT NULL,
  `summary` varchar(2000),
  `age_range` varchar(200) NULL;
  `channel_id` int,
  `release_date` DATE,
  `count` int,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `channel` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL UNIQUE
);

CREATE TABLE `genre` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `genre` varchar(255) NOT NULL UNIQUE
);

CREATE TABLE `participants` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` varchar(255) UNIQUE,
  `participant_type_id` int NOT NULL
);

CREATE TABLE `participant_type` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `type` varchar(255) NOT NULL UNIQUE
);

CREATE TABLE `genre_program` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `program_id` int NOT NULL,
  `genre_id` int NOT NULL
);

CREATE TABLE `participants_program` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `program_id` int NOT NULL,
  `participants_id` int NOT NULL
);

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `nickname` varchar(255),
  `password` varchar(1000) NOT NULL,
  `membership` boolean,
  `social_login_id` int,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `social_login` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `social_media_name` varchar(255) NOT NULL UNIQUE
);

CREATE TABLE `episode` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `program_id` int NOT NULL,
  `episode_num` int NOT NULL,
  `img_url` varchar(2000) NOT NULL,
  `video_url` varchar(2000) NOT NULL,
  `summary` varchar(2000),
  `release_date` DATE,
  `running_time` int,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `like` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL ,
  `program_id` int NOT NULL ,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `watching_history` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
  `user_id` int NOT NULL ,
  `episode_id` int NOT NULL ,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `popular_search_log` (
  `id` int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
  `program_id` int NOT NULL ,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `watching_history` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) on DELETE CASCADE ;

ALTER TABLE `like` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) on DELETE CASCADE;

ALTER TABLE `like` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) on DELETE CASCADE;

ALTER TABLE `episode` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) on DELETE CASCADE;

ALTER TABLE `genre_program` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) on DELETE CASCADE;

ALTER TABLE `participants_program` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) on DELETE CASCADE;

ALTER TABLE `genre_program` ADD FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`) on DELETE CASCADE;

ALTER TABLE `watching_history` ADD FOREIGN KEY (`episode_id`) REFERENCES `episode` (`id`) on DELETE CASCADE;

ALTER TABLE `popular_search_log` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) on DELETE CASCADE;

ALTER TABLE `user` ADD FOREIGN KEY (`social_login_id`) REFERENCES `social_login` (`id`) on DELETE CASCADE;

ALTER TABLE `participants` ADD FOREIGN KEY (`participant_type_id`) REFERENCES `participant_type` (`id`) on DELETE CASCADE;

ALTER TABLE `participants_program` ADD FOREIGN KEY (`participants_id`) REFERENCES `participants` (`id`) on DELETE CASCADE;

ALTER TABLE `program` ADD FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`) on DELETE CASCADE;