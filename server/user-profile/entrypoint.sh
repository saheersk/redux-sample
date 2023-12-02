#!/bin/bash

cd /user-profile/ || exit

# Start the Django application
gunicorn -b 0.0.0.0:8000 user_profile.wsgi:application
