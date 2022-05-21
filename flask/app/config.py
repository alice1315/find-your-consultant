import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.urandom(64)

# MYSQL_CONFIG = {
#     'user': os.getenv("user"), 
#     'password': os.getenv("password"),
#     'host': '127.0.0.1',
#     'database': 'find_your_consultant'
# }

MYSQL_CONFIG = {
    'user': os.getenv("rds_user"), 
    'password': os.getenv("rds_password"),
    'host': os.getenv("rds_host"),
    'database': 'find_your_consultant'
}
