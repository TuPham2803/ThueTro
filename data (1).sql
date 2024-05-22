-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: homedb
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_user'),(22,'Can change user',6,'change_user'),(23,'Can delete user',6,'delete_user'),(24,'Can view user',6,'view_user'),(25,'Can add follow',7,'add_follow'),(26,'Can change follow',7,'change_follow'),(27,'Can delete follow',7,'delete_follow'),(28,'Can view follow',7,'view_follow'),(29,'Can add post accommodation',8,'add_postaccommodation'),(30,'Can change post accommodation',8,'change_postaccommodation'),(31,'Can delete post accommodation',8,'delete_postaccommodation'),(32,'Can view post accommodation',8,'view_postaccommodation'),(33,'Can add comment accommodation',9,'add_commentaccommodation'),(34,'Can change comment accommodation',9,'change_commentaccommodation'),(35,'Can delete comment accommodation',9,'delete_commentaccommodation'),(36,'Can view comment accommodation',9,'view_commentaccommodation'),(37,'Can add accommodation image',10,'add_accommodationimage'),(38,'Can change accommodation image',10,'change_accommodationimage'),(39,'Can delete accommodation image',10,'delete_accommodationimage'),(40,'Can view accommodation image',10,'view_accommodationimage'),(41,'Can add post request',11,'add_postrequest'),(42,'Can change post request',11,'change_postrequest'),(43,'Can delete post request',11,'delete_postrequest'),(44,'Can view post request',11,'view_postrequest'),(45,'Can add comment request',12,'add_commentrequest'),(46,'Can change comment request',12,'change_commentrequest'),(47,'Can delete comment request',12,'delete_commentrequest'),(48,'Can view comment request',12,'view_commentrequest'),(49,'Can add like accommodation',13,'add_likeaccommodation'),(50,'Can change like accommodation',13,'change_likeaccommodation'),(51,'Can delete like accommodation',13,'delete_likeaccommodation'),(52,'Can view like accommodation',13,'view_likeaccommodation'),(53,'Can add like request',14,'add_likerequest'),(54,'Can change like request',14,'change_likerequest'),(55,'Can delete like request',14,'delete_likerequest'),(56,'Can view like request',14,'view_likerequest'),(57,'Can add application',15,'add_application'),(58,'Can change application',15,'change_application'),(59,'Can delete application',15,'delete_application'),(60,'Can view application',15,'view_application'),(61,'Can add access token',16,'add_accesstoken'),(62,'Can change access token',16,'change_accesstoken'),(63,'Can delete access token',16,'delete_accesstoken'),(64,'Can view access token',16,'view_accesstoken'),(65,'Can add grant',17,'add_grant'),(66,'Can change grant',17,'change_grant'),(67,'Can delete grant',17,'delete_grant'),(68,'Can view grant',17,'view_grant'),(69,'Can add refresh token',18,'add_refreshtoken'),(70,'Can change refresh token',18,'change_refreshtoken'),(71,'Can delete refresh token',18,'delete_refreshtoken'),(72,'Can view refresh token',18,'view_refreshtoken'),(73,'Can add id token',19,'add_idtoken'),(74,'Can change id token',19,'change_idtoken'),(75,'Can delete id token',19,'delete_idtoken'),(76,'Can view id token',19,'view_idtoken');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-05-22 12:32:53.195340','2','nguoi',1,'[{\"added\": {}}]',6,1),(2,'2024-05-22 12:33:15.705564','2','nguoithue',2,'[{\"changed\": {\"fields\": [\"Username\"]}}]',6,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(10,'homes','accommodationimage'),(9,'homes','commentaccommodation'),(12,'homes','commentrequest'),(7,'homes','follow'),(13,'homes','likeaccommodation'),(14,'homes','likerequest'),(8,'homes','postaccommodation'),(11,'homes','postrequest'),(6,'homes','user'),(16,'oauth2_provider','accesstoken'),(15,'oauth2_provider','application'),(17,'oauth2_provider','grant'),(19,'oauth2_provider','idtoken'),(18,'oauth2_provider','refreshtoken'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-05-22 12:17:05.283769'),(2,'contenttypes','0002_remove_content_type_name','2024-05-22 12:17:05.393257'),(3,'auth','0001_initial','2024-05-22 12:17:05.690444'),(4,'auth','0002_alter_permission_name_max_length','2024-05-22 12:17:05.750001'),(5,'auth','0003_alter_user_email_max_length','2024-05-22 12:17:05.756501'),(6,'auth','0004_alter_user_username_opts','2024-05-22 12:17:05.763967'),(7,'auth','0005_alter_user_last_login_null','2024-05-22 12:17:05.770201'),(8,'auth','0006_require_contenttypes_0002','2024-05-22 12:17:05.772227'),(9,'auth','0007_alter_validators_add_error_messages','2024-05-22 12:17:05.778990'),(10,'auth','0008_alter_user_username_max_length','2024-05-22 12:17:05.784700'),(11,'auth','0009_alter_user_last_name_max_length','2024-05-22 12:17:05.791997'),(12,'auth','0010_alter_group_name_max_length','2024-05-22 12:17:05.815287'),(13,'auth','0011_update_proxy_permissions','2024-05-22 12:17:05.821994'),(14,'auth','0012_alter_user_first_name_max_length','2024-05-22 12:17:05.831862'),(15,'homes','0001_initial','2024-05-22 12:17:07.256634'),(16,'admin','0001_initial','2024-05-22 12:17:07.432855'),(17,'admin','0002_logentry_remove_auto_add','2024-05-22 12:17:07.447910'),(18,'admin','0003_logentry_add_action_flag_choices','2024-05-22 12:17:07.464014'),(19,'oauth2_provider','0001_initial','2024-05-22 12:17:08.633539'),(20,'oauth2_provider','0002_auto_20190406_1805','2024-05-22 12:17:08.800549'),(21,'oauth2_provider','0003_auto_20201211_1314','2024-05-22 12:17:08.883123'),(22,'oauth2_provider','0004_auto_20200902_2022','2024-05-22 12:17:09.325528'),(23,'oauth2_provider','0005_auto_20211222_2352','2024-05-22 12:17:09.419644'),(24,'oauth2_provider','0006_alter_application_client_secret','2024-05-22 12:17:09.460982'),(25,'oauth2_provider','0007_application_post_logout_redirect_uris','2024-05-22 12:17:09.567168'),(26,'sessions','0001_initial','2024-05-22 12:17:09.610449');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('21emtcgpqe774wptsb9v9pz0bxvhj8q8','.eJxVjEEOwiAQRe_C2pCCQ7Eu3XsGMswMUjWQlHZlvLuSdKHb_977LxVwW3PYmixhZnVWRh1-t4j0kNIB37HcqqZa1mWOuit6p01fK8vzsrt_Bxlb_tYTu2T4RIgDpCRWjtZFHqwB8sYBjeCkEwfgmWIcBYUYAMVPKOjV-wMCoTkY:1s9l19:4O4WyjXr4Prb_B5mOroQS9p7-uOx5a2oYWf02pI-8mA','2024-06-05 12:24:27.997578');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_accommodationimage`
--

LOCK TABLES `homes_accommodationimage` WRITE;
/*!40000 ALTER TABLE `homes_accommodationimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_accommodationimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_commentaccommodation`
--

LOCK TABLES `homes_commentaccommodation` WRITE;
/*!40000 ALTER TABLE `homes_commentaccommodation` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_commentaccommodation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_commentrequest`
--

LOCK TABLES `homes_commentrequest` WRITE;
/*!40000 ALTER TABLE `homes_commentrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_commentrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_follow`
--

LOCK TABLES `homes_follow` WRITE;
/*!40000 ALTER TABLE `homes_follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_likeaccommodation`
--

LOCK TABLES `homes_likeaccommodation` WRITE;
/*!40000 ALTER TABLE `homes_likeaccommodation` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_likeaccommodation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_likerequest`
--

LOCK TABLES `homes_likerequest` WRITE;
/*!40000 ALTER TABLE `homes_likerequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_likerequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_postaccommodation`
--

LOCK TABLES `homes_postaccommodation` WRITE;
/*!40000 ALTER TABLE `homes_postaccommodation` DISABLE KEYS */;
INSERT INTO `homes_postaccommodation` VALUES (1,'2024-05-22 12:43:26.467171','2024-05-22 12:43:26.467171',1,'Charming Apartment in City Center','New York','Manhattan','123 Main Street',40.7128,-74.006,75.5,2000,'PR',2,1,'123-456-7890','This charming apartment is located in the heart of Manhattan...','PD',1,1),(2,'2024-05-22 12:47:05.198482','2024-05-22 12:47:05.198482',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(3,'2024-05-22 12:47:27.167093','2024-05-22 12:47:27.167093',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(4,'2024-05-22 12:48:01.400993','2024-05-22 12:48:01.400993',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(5,'2024-05-22 12:50:55.862938','2024-05-22 12:50:55.862938',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(6,'2024-05-22 12:51:48.886139','2024-05-22 12:51:48.886139',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(7,'2024-05-22 13:00:09.379350','2024-05-22 13:00:09.379350',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(8,'2024-05-22 13:00:28.809207','2024-05-22 13:00:28.809207',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(9,'2024-05-22 13:00:50.348557','2024-05-22 13:00:50.348557',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(10,'2024-05-22 13:01:06.401975','2024-05-22 13:01:06.401975',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(11,'2024-05-22 13:02:18.327237','2024-05-22 13:02:18.327237',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(12,'2024-05-22 13:02:38.549096','2024-05-22 13:02:38.549096',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(13,'2024-05-22 13:14:24.401859','2024-05-22 13:14:24.401859',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(14,'2024-05-22 13:14:25.707950','2024-05-22 13:14:25.707950',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(15,'2024-05-22 13:16:12.598020','2024-05-22 13:16:12.599033',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1),(16,'2024-05-22 13:16:13.932419','2024-05-22 13:16:13.932419',1,'Luxury Apartment in Downtown','New York','Manhattan','123 Main Street',40.7128,-74.006,120.5,3000,'PR',4,2,'123-456-7890','This luxury apartment offers stunning views of the city skyline...','PD',1,1);
/*!40000 ALTER TABLE `homes_postaccommodation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_postrequest`
--

LOCK TABLES `homes_postrequest` WRITE;
/*!40000 ALTER TABLE `homes_postrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_postrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_user`
--

LOCK TABLES `homes_user` WRITE;
/*!40000 ALTER TABLE `homes_user` DISABLE KEYS */;
INSERT INTO `homes_user` VALUES (1,'pbkdf2_sha256$720000$MVLSs7rohCaoJoGQc3W4DA$n6yb6SCGI+3a7q81xBm0HYPbaLbX7Wdg9xMPraqX5To=','2024-05-22 12:24:27.992794',1,'khatu','','',1,1,'2024-05-22 12:20:11.798969','tu@gmail.com','',NULL),(2,'pbkdf2_sha256$720000$MVLSs7rohCaoJoGQc3W4DA$n6yb6SCGI+3a7q81xBm0HYPbaLbX7Wdg9xMPraqX5To=',NULL,0,'nguoithue','','',0,1,'2024-05-22 12:31:01.000000','tu1233@gmail.com','tenant','image/upload/v1716381172/jav1ksirzfimhcpuuv0m.png');
/*!40000 ALTER TABLE `homes_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_user_groups`
--

LOCK TABLES `homes_user_groups` WRITE;
/*!40000 ALTER TABLE `homes_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `homes_user_user_permissions`
--

LOCK TABLES `homes_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `homes_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `homes_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `oauth2_provider_accesstoken`
--

LOCK TABLES `oauth2_provider_accesstoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_accesstoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_accesstoken` VALUES (1,'7VyuQb4hxY4LPSIDg0Gj3MfAl8nxPI','2024-05-23 00:43:13.540414','read write',1,1,'2024-05-22 14:43:13.541419','2024-05-22 14:43:13.541419',NULL,NULL);
/*!40000 ALTER TABLE `oauth2_provider_accesstoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `oauth2_provider_application`
--

LOCK TABLES `oauth2_provider_application` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_application` DISABLE KEYS */;
INSERT INTO `oauth2_provider_application` VALUES (1,'C1iBBBCz7jcOGNCjUukbMalWOZ3HVLaYZJeg2RcD','','confidential','password','pbkdf2_sha256$720000$R6lnlrQoL1ppBdht83gv2L$LgjbHlDW3wICJHFzVrUvyUU2aVMth8jc0eBhvTRRZHo=','',1,0,'2024-05-22 14:42:37.658653','2024-05-22 14:42:37.658653','','');
/*!40000 ALTER TABLE `oauth2_provider_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `oauth2_provider_grant`
--

LOCK TABLES `oauth2_provider_grant` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_grant` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_provider_grant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `oauth2_provider_idtoken`
--

LOCK TABLES `oauth2_provider_idtoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_idtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_provider_idtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `oauth2_provider_refreshtoken`
--

LOCK TABLES `oauth2_provider_refreshtoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_refreshtoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_refreshtoken` VALUES (1,'3XVOPLrzEdgkOxNNN9GsoiyMj326wt',1,1,1,'2024-05-22 14:43:13.549194','2024-05-22 14:43:13.549194',NULL);
/*!40000 ALTER TABLE `oauth2_provider_refreshtoken` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 21:43:39
