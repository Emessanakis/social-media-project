-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: users
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,2,2,'Nice view !!'),(2,2,3,'Love the woods !'),(3,2,4,'Breathtaking view !!!'),(4,1,3,'Love it !'),(5,1,47,'Nice view !!'),(6,3,48,'Breathtaking !');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendships`
--

DROP TABLE IF EXISTS `friendships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendships` (
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendships`
--

LOCK TABLES `friendships` WRITE;
/*!40000 ALTER TABLE `friendships` DISABLE KEYS */;
INSERT INTO `friendships` VALUES (2,4),(2,5),(2,47),(2,48),(1,3),(1,4),(66,1),(66,2),(66,3),(1,2);
/*!40000 ALTER TABLE `friendships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `user_id` int NOT NULL,
  `post_id` int NOT NULL AUTO_INCREMENT,
  `post_title` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `post_icon` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `post_likes` int NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,1,'Brown Rocks During Golden Hour','pex2014422.jpeg',3),(4,2,'In the Woods','pex1448735.jpg',6),(5,3,'Deden Picky Ramdhani','pex2880507.jpeg',4);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_accs`
--

DROP TABLE IF EXISTS `user_accs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_accs` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `icon` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accs`
--

LOCK TABLES `user_accs` WRITE;
/*!40000 ALTER TABLE `user_accs` DISABLE KEYS */;
INSERT INTO `user_accs` VALUES (1,'Joe123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Joe123@gmail.com','Joe Dougherty','79.jpg'),(2,'Jason123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Jason123@gmail.com','Jason Cline','94.jpg'),(3,'Pawel123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Pawel123@gmail.com','Pawel Rowen','44.jpg'),(4,'Robin123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Robin123@gmail.com','Robin Hartman','32.jpg'),(5,'Steve123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Steve123@gmail.com','Steve Espinoza','21.jpg'),(47,'Caitlyn123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Caitlyn123@gmail.com','Caitlyn Gae','w21.jpg'),(48,'Kelan123','$2b$10$ej5FRsJSBOPj1sS3rL2J2unRAf07QKhjkq9oL1Lq9WWIYWrTy7zM2','Kelan123@gmail.com','Kelan Darby','w19.jpg');
/*!40000 ALTER TABLE `user_accs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-16 21:27:45
