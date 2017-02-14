// DROP TABLE IF EXISTS `Users`;

// CREATE TABLE `Users` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `UserName` VARCHAR(30) NOT NULL DEFAULT 'NULL',
//   `Password` VARCHAR(30) NULL DEFAULT NULL,
//   `Profile_Picture` VARBINARY NOT NULL DEFAULT 'NULL' COMMENT 'File size should be under 256kb or 800x800',
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Games'
// -- Holds Game States for All Games
// -- ---
// CREATE TABLE `monopoly`.`fb_user` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `fbID` VARCHAR(45) NOT NULL,
//   `displayname` VARCHAR(45) NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `fbID_UNIQUE` (`fbID` ASC));
// DROP TABLE IF EXISTS `Games`;

// CREATE TABLE `Games` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `id_Current_Game` INTEGER NULL DEFAULT NULL,
//   `id_Users` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// ) COMMENT 'Holds Game States for All Games';

// -- ---
// -- Table 'Current_Game'
// --
// -- ---

// DROP TABLE IF EXISTS `Current_Game`;

// CREATE TABLE `Current_Game` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `Game_state` VARCHAR NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Foreign Keys
// -- ---

// ALTER TABLE `Games` ADD FOREIGN KEY (id_Current_Game) REFERENCES `Current_Game` (`id`);
// ALTER TABLE `Games` ADD FOREIGN KEY (id_Users) REFERENCES `Users` (`id`);

// -- ---
// -- Table Properties
// -- ---

// -- ALTER TABLE `Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Games` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Current_Game` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

// -- ---
// -- Test Data
// -- ---

// -- INSERT INTO `Users` (`id`,`UserName`,`Password`,`Profile_Picture`) VALUES
// -- ('','','','');
// -- INSERT INTO `Games` (`id`,`id_Current_Game`,`id_Users`) VALUES
// -- ('','','');
// -- INSERT INTO `Current_Game` (`id`,`Game_state`) VALUES
// -- ('','');
