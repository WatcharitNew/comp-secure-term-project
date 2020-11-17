FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]