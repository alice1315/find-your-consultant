import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.urandom(64)

TAPPAY_PARTNER_KEY = os.getenv("tappay_partner_key")

MYSQL_CONFIG = {
    'user': os.getenv("rds_user"), 
    'password': os.getenv("rds_password"),
    'host': os.getenv("rds_host"),
    'database': 'find_your_consultant'
}
