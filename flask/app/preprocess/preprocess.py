import os

from dotenv import load_dotenv

import mysql.connector
from mysql.connector import errorcode


load_dotenv()
# MYSQL_CONFIG = {
#     'user': os.getenv("user"), 
#     'password': os.getenv("password"),
#     'host': '127.0.0.1',
# }

MYSQL_CONFIG = {
    'user': os.getenv("rds_user"), 
    'password': os.getenv("rds_password"),
    'host': os.getenv("rds_host")
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
    "  UNIQUE (`field_name`),"
    "  UNIQUE (`field_code`))")

TABLES['consultant'] = (
    "CREATE TABLE `consultant` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `email` varchar(255) NOT NULL,"
    "  `password` varchar(255) NOT NULL,"
    "  `pic_url` varchar(255) NOT NULL,"
    "  `name` varchar(50) NOT NULL,"
    "  `gender` varchar(10) NOT NULL,"
    "  `phone` varchar(15),"
    "  `fields` varchar(255) NOT NULL,"
    "  `certificate_url` varchar(255) NOT NULL,"
    "  `agency` varchar(20),"
    "  `job_title` varchar(20),"
    "  `price` int NOT NULL,"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`email`))")

TABLES['member'] = (
    "CREATE TABLE `member` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `email` varchar(255) NOT NULL,"
    "  `password` varchar(255) NOT NULL,"
    "  `pic_url` varchar(255) NOT NULL,"
    "  `name` varchar(50) NOT NULL,"
    "  `gender` varchar(10) NOT NULL,"
    "  `phone` varchar(15),"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`email`))")

TABLES['case'] = (
    "CREATE TABLE `case` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `case_id` varchar(50) NOT NULL,"
    "  `field_code` varchar(50) NOT NULL,"
    "  `member_id` bigint NOT NULL,"
    "  `consultant_id` bigint NOT NULL,"
    "  `status` varchar(10) NOT NULL,"
    "  `price_per_hour` int,"
    "  `hours` int,"
    "  `total_price` int,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`case_id`),"
    "  FOREIGN KEY (`member_id`) REFERENCES member(`id`),"
    "  FOREIGN KEY (`consultant_id`) REFERENCES consultant(`id`))")

TABLES['case_messages'] = (
    "CREATE TABLE `case_messages` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `case_id` varchar(50) NOT NULL,"
    "  `sender_membership` varchar(255) NOT NULL,"
    "  `message` varchar(255) NOT NULL,"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`case_id`) REFERENCES `case`(`case_id`))")

TABLES['payment'] = (
    "CREATE TABLE `payment` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `case_id` varchar(50) NOT NULL,"
    "  `payment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  `status` varchar(5) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`case_id`) REFERENCES `case`(`case_id`))")

TABLES['feedback'] = (
    "CREATE TABLE `feedback` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `case_id` varchar(50) NOT NULL,"
    "  `consultant_rating` int,"
    "  `consultant_feedback` varchar(255),"
    "  `platform_feedback` varchar(255),"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`case_id`),"
    "  FOREIGN KEY (`case_id`) REFERENCES `case`(`case_id`))")  


"""
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

"""
# Insert fields
insert_field = ("INSERT INTO fields (field_name, field_code) VALUES (%s, %s)")
field_data_list = [("稅務", "ta"), ("會計", "ac"), ("金融", "fi"), ("刑法", "ci"), ("民法", "cr"), ("公司法", "co")]
for data in field_data_list:
    cursor.execute(insert_field, data)
"""

cnx.commit()

print("Closing")
cursor.close()
cnx.close()
