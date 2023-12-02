#!/bin/bash

cd /user-profile/ || exit

# Apply database migrations
python manage.py migrate --noinput
# python manage.py collectstatic --noinput