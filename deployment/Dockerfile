# Stage 1
# FROM nginx:latest
FROM nginx:latest
COPY ./deployment/nginx.conf /etc/nginx/nginx.conf

ENV PORT 3000

# Copy static apps
COPY ./build /usr/share/nginx/apps

# Building app
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
