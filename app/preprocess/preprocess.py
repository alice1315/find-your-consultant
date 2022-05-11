import os

from dotenv import load_dotenv

import mysql.connector
from mysql.connector import errorcode


load_dotenv()
MYSQL_CONFIG = {
    'user': os.getenv("user"), 
    'password': os.getenv("password"),
    'host': '127.0.0.1',
}

# Connecting to MySQL
try:
    cnx = mysql.connector.connect(**MYSQL_CONFIG)
except mysql.connector.Error as err:
    print(err)

else:
    print("Successfully connected to MySQL.")

cursor = cnx.cursor()


# Using/Creating database
DB_NAME = "find_your_consultant"

def create_database(cursor):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))
        exit(1)

try:
    cursor.execute("USE {}".format(DB_NAME))
except mysql.connector.Error as err:
    print("Database {} does not exists.".format(DB_NAME))
    if err.errno == errorcode.ER_BAD_DB_ERROR:
        create_database(cursor)
        print("Database {} created successfully.".format(DB_NAME))
        cnx.database = DB_NAME
    else:
        print(err)
        exit(1)


# Creating tables
TABLES = {}
TABLES['fields'] = (
    "CREATE TABLE `fields` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `field_name` varchar(50) NOT NULL,"
    "  `field_code` varchar(50) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`field_name`))")
"""
TABLES['images'] = (
    "CREATE TABLE `images` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `name` varchar(50) NOT NULL,"
    "  `image_url` varchar(255) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`name`) REFERENCES spots(`name`))")

TABLES['member'] = (
    "CREATE TABLE `member` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `name` varchar(255) NOT NULL,"
    "  `email` varchar(255) NOT NULL,"
    "  `password` varchar(255) NOT NULL,"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`email`))")

TABLES['shopping_cart'] = (
    "CREATE TABLE `shopping_cart` ("
    "  `user_id` bigint NOT NULL,"
    "  `attraction_id` bigint NOT NULL,"
    "  `attraction_name` varchar(50) NOT NULL,"
    "  `attraction_address` varchar(50),"
    "  `attraction_images` varchar(3000),"
    "  `date` date NOT NULL,"
    "  `time` varchar(30) NOT NULL,"
    "  `price` int NOT NULL,"
    "  PRIMARY KEY (`user_id`),"
    "  FOREIGN KEY (`user_id`) REFERENCES member(`id`))")

TABLES['orders'] = (
    "CREATE TABLE `orders` ("
    "  `order_number` bigint NOT NULL,"
    "  `user_id` bigint NOT NULL,"
    "  `attraction_id` bigint NOT NULL,"
    "  `attraction_name` varchar(50) NOT NULL,"
    "  `attraction_address` varchar(50),"
    "  `attraction_image` varchar(600),"
    "  `contact_name` varchar(10) NOT NULL,"
    "  `contact_email` varchar(100) NOT NULL,"
    "  `contact_phone` varchar(15) NOT NULL,"
    "  `date` date NOT NULL,"
    "  `time` varchar(10) NOT NULL,"
    "  `price` int NOT NULL,"
    "  `order_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  `status` varchar(5) NOT NULL,"
    "  PRIMARY KEY (`order_number`),"
    "  FOREIGN KEY (`user_id`) REFERENCES member(`id`))")

TABLES['payment'] = (
    "CREATE TABLE `payment` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `order_number` bigint NOT NULL,"
    "  `payment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  `status` varchar(5) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`order_number`) REFERENCES orders(`order_number`))")   
"""
for table_name in TABLES:
    table_description = TABLES[table_name]
    try:
        print("Creating table {}: ".format(table_name), end='')
        cursor.execute(table_description)
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
            print("already exists.")
        else:
            print(err.msg)
    else:
        print("OK")


cnx.commit()

print("Closing")
cursor.close()
cnx.close()
