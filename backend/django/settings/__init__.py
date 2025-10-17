import os

# Load environment variable (default = 'dev')
DJANGO_ENV = os.getenv('DJANGO_ENV', 'dev').lower()

if DJANGO_ENV == 'prod':
    from .prod import *
else:
    from .dev import *
