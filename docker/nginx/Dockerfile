# Usamos nginx:stable-alpine como base, ya que es pequeña y rápida.
FROM nginx:stable-alpine

# 1. Instalar herramientas necesarias (ej. para gestión de usuarios)
RUN apk update && apk add --no-cache shadow

# 2. CREAR el usuario y grupo 'www-data' (GID 82 es estándar en Debian/Ubuntu)
# Esto asegura que Nginx y PHP-FPM reconozcan el mismo ID de usuario/grupo.
RUN groupadd -g 82 www-data || true && \
    usermod -a -G www-data nginx

# . Exponer el puerto
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]