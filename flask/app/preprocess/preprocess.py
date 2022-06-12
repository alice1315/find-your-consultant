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

# MYSQL_CONFIG = {
#     'user': os.getenv("rds_user"), 
#     'password': os.getenv("rds_password"),
#     'host': os.getenv("rds_host")
# }

# Connecting to MySQL
try:
    cnx = mysql.connector.connect(**MYSQL_CONFIG)
except mysql.connector.Error as err:
    print(err)

else:
    print("Successfully connected to MySQL.")

cursor = cnx.cursor()


# Using/Creating database
DB_NAME = "find_your_consultant_test"

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
    "  `field_code` varchar(10) NOT NULL,"
    "  `field_name` varchar(10) NOT NULL,"
    "  PRIMARY KEY (`field_code`),"
    "  UNIQUE (`field_name`))")

TABLES['consultant'] = (
    "CREATE TABLE `consultant` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `email` varchar(255) NOT NULL,"
    "  `password` varchar(255) NOT NULL,"
    "  `pic_url` varchar(255) NOT NULL,"
    "  `name` varchar(50) NOT NULL,"
    "  `gender` varchar(10) NOT NULL,"
    "  `phone` varchar(15) NOT NULL,"
    "  `certificate_url` varchar(255) NOT NULL,"
    "  `agency` varchar(20) NOT NULL,"
    "  `job_title` varchar(20) NOT NULL,"
    "  `price` int NOT NULL,"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE (`email`))")

TABLES['consultant_fields'] = (
    "CREATE TABLE `consultant_fields` ("
    "  `id` bigint NOT NULL AUTO_INCREMENT,"
    "  `consultant_id` bigint NOT NULL,"
    "  `field_code` varchar(10) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`consultant_id`) REFERENCES consultant(`id`),"
    "  FOREIGN KEY (`field_code`) REFERENCES fields(`field_code`))")

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
    "  `case_id` varchar(50) NOT NULL,"
    "  `field_code` varchar(50) NOT NULL,"
    "  `member_id` bigint NOT NULL,"
    "  `consultant_id` bigint NOT NULL,"
    "  `status` varchar(10) NOT NULL,"
    "  `price_per_hour` int,"
    "  `hours` int,"
    "  `total_price` int,"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`case_id`),"
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

TABLES['read_status'] = (
    "CREATE TABLE `read_status` ("
    "  `case_id` varchar(50) NOT NULL,"
    "  `member` int,"
    "  `consultant` int,"
    "  PRIMARY KEY (`case_id`),"
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
    "  `case_id` varchar(50) NOT NULL,"
    "  `consultant_rating` int,"
    "  `consultant_feedback` varchar(255),"
    "  `platform_feedback` varchar(255),"
    "  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  PRIMARY KEY (`case_id`),"
    "  FOREIGN KEY (`case_id`) REFERENCES `case`(`case_id`))")  

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
