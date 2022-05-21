import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.urandom(64)

MYSQL_CONFIG = {
    'user': os.getenv("user"), 
    'password': os.getenv("password"),
    'host': '127.0.0.1',
    'database': 'find_your_consultant'
}