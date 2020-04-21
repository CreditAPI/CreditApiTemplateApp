FROM nginx:alpine
COPY dist/credit-api-template-app/ru /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/js/settings.template.js > /usr/share/nginx/html/assets/js/settings.js && exec nginx -g 'daemon off;'"]