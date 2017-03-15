FROM nginx:1.11.8-alpine

COPY app /usr/share/nginx/html/app
COPY index.html /usr/share/nginx/html/
COPY images /usr/share/nginx/html/images
COPY bower_components /usr/share/nginx/html/bower_components
