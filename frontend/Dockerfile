# Use Nginx to serve static files
FROM nginx:alpine

# Copy the HTML file into Nginx's html directory
COPY index.html /usr/share/nginx/html/

# Thêm dòng này để copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
