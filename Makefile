# Define los nombres de los contenedores
APP_CONTAINER := ritmatiza_app
DB_CONTAINER := ritmatiza_db

# Comando para entrar al contenedor de la aplicación
EXEC_APP := docker compose exec $(APP_CONTAINER)

# Iniciar la aplicación: Levanta, construye (si es necesario) y ejecuta la configuración inicial
up:
	@echo "Levantando contenedores (Docker Compose Up)..."
	docker compose up --build -d
	@echo "Esperando 5 segundos para que la base de datos se inicialice..."
	sleep 5
	@echo "Configurando la aplicación..."
	$(MAKE) setup
	@echo "Aplicación Ritmatiza lista. Ejecuta 'npm run dev' en la carpeta 'frontend' y accede a o http://localhost"

# Tarea de configuración inicial (Instalación de dependencias, migraciones, claves)
setup:
	@echo "Instalando dependencias de PHP..."
	$(EXEC_APP) composer install
	@echo "Generando claves de aplicación y JWT..."
	cp ./backend/.env.example ./backend/.env
	$(EXEC_APP) php artisan key:generate
	$(EXEC_APP) php artisan jwt:secret
	@echo "Ejecutando migraciones y seeders..."
	$(EXEC_APP) php artisan migrate:fresh --seed
	@echo "Configurando permisos y enlace de almacenamiento..."
	$(EXEC_APP) chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache
	$(EXEC_APP) php artisan storage:link
	@echo "Configuración de backend completada."

# Detener los servicios
down:
	@echo "Deteniendo y eliminando contenedores..."
	docker compose down

# Limpiar los volúmenes de base de datos
clean:
	@echo "Eliminando contenedores y volúmenes de base de datos..."
	docker compose down -v