# 🎵 RITMATIZA - Gamificación del aprendizaje

## Introducción

Ritmatiza es un proyecto que comenzó como una manera de motivar a los estudiantes a que se esfuercen en realizar las tareas. Esta aplicación consiste en un servicio de entrega de trabajos para obtener puntos, para posteriormente gastarlos en la solicitud de canciones para solicitar que pongan su canción favorita en los recreos. 

## Datos a tener en cuenta

Para este proyecto se ha utilizado la configuración del archivo /etc/hosts y añadido la línea `127.0.0.1 localhost ritmatiza.local`. 

En el caso de querer importar la base de datos utilizada de manera local, se podrá importar el script sql `ritmatiza_db.sql`. Para ello simplemente tendremos que pegar el script introducido en el .zip entregado y posteriormente ejecutar el siguiente comando en la terminal desde la raíz del proyecto:

```bash
mysql -u <usuario> -p <nombre_bbdd> < ritmatiza_db.sql
```

## Despliegue

Este proyecto utiliza contenedores de Docker para servir los servicios, y su despliegue es bastante sencillo:

### Prerrequisitos

Asegúrate de tener instalado Git, Docker y Docker Compose.

### Pasos a seguir

#### Clonar repositorio

```bash
git clone https://github.com/JorCodeSprout/Proyecto_ritmatiza.git

cd Proyecto_ritmatiza
```

#### Archivo .env

Para poder levantar los contenedores de Docker es necesario configurar nuestro `.env` y añadir las siguientes líneas. Los valores de dichas variables, estarán en un README de acceso enviado a los profesores para este proyecto, para que de esta manera se puedan conectar a la base de datos que está desplegada. Para obtener esas variables simplemente hay que acceder a [este archivo](./README-acceso.md).

```bash
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ritmatiza
DB_USERNAME=<usuario>
DB_PASSWORD=<contraseña>
```

#### Levantar contenedores

Una vez en el directorio del respositorio tendremos que ejecutar el siguiente comando para levantar los contenedores:

```bash
docker compose up --build -d

docker compose ps  # Para asegurarnos que los contenedores están correctamente levantados
```

#### Instalar dependencias de PHP

Para instalar las dependencias del backend será necesario ejecutar el siguiente comando:

```bash
docker compose exec app composer install
```

#### Generar Clave de aplicación

Una vez instaladas las dependencias procedemos a copiar el contenido del ./backend/.env.example en el archivo ./backend/.env

```bash
copy ./backend/.env.example ./backend/.env # Para Linux/macOS - Windows => cp en vez de copy
docker compose exec app php artisan key:generate
```

#### Generar clave JWT para controlar token

Para esta aplicación es necesaria una clave JWT para firmar digitalmente el token cuando se inicia sesión.

```bash
docker compose exec app php artisan jwt:secret
```

#### Ejecutar las migraciones

Antes de migrar la base de datos tenemos que añadir las variables que creamos en el primer paso despues de clonar el repositorio para que se cree la base de datos si no existe.

```bash
docker compose exec app php artisan migrate --seed
```

#### Ajustar permisos

Una vez los contenedores estén correctamente levantados hay que dar permisos al contenedor `app` para escribir en las carpetas de `storage` y `caché`.

```bash
docker compose exec app chmod -R 777 /var/www/html/storage
docker compose exec app chmod -R 777 /var/www/html/bootstrap/cache
docker compose exec app php artisan storage:link
```

#### Inicio Vite Dev Server

Una vez están distribuidos los permisos tenemos que ir a la carpeta del directorio `ritmatiza` - `./frontend` e iniciar el servidor de desarrollo.

```bash
cd frontend
npm install  # Instalar las dependencias por primera vez
npm run dev
```

#### .env

Una vez estén todos los contenedores levantados correctamente, procederemos a añadir las variables de entorno necesarias para la conexión con la API de Spotify y de Mailer, haciendo que finalmente el .env quede algo similar a esto:

```bash
APP_NAME="Ritmatiza Local"
APP_ENV=local
APP_KEY= 
APP_DEBUG=false 
APP_URL=http://ritmatiza.local

# Variables de entorno Docker Compose y MySQL
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ritmatiza
DB_USERNAME=<usuario>
DB_PASSWORD=<contraseña>

# Spotify API - Sustituye con tus credenciales
SPOTIFY_CLIENT_ID=<client_id_spotify_dev>
SPOTIFY_CLIENT_SECRET=<client_secret_spotify_dev>
SPOTIFY_REDIRECT_URI=${APP_URL}/api/spotify/callback
SPOTIFY_PLAYLIST_ID=<id_playlist_spotify>

MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=<email@email.com>
MAIL_PASSWORD="app password"
MAIL_FROM_ADDRESS="<email@email.com>"
MAIL_FROM_NAME="${APP_NAME}"

JWT_SECRET=<clave_JWT_token>
```

### Makefile

En caso de preferirse se da la opción de ejecutar un solo comando que hace todo lo anteriormente nombrado y dicho comando es `make up`, el cual se encargará de levantar los contenedores, la configuración inicial instalando las dependencias necesarias de PHP, copiar el archivo de configuración `.env.example` a `.env`, generar las claves tanto de aplicación como la clave JWT, ejecuta las migraciónes y seeders para configurar las tablas y los datos iniciales y por último configura los permisos necesarios y crea el enlace de almacentamiento con `php artisan storage:link`.

Una vez se quiera detener la aplicación se puede utilizar el comando `make down` o `make clear` para limpiar de manera completa los contenedores y los volúmenes de datos asociados a la base de datos.

(En el .zip recibido pueden coger el .env que hay en tanto en ./backend como en el directorio raíz para poder realizar las pruebas necesarias).

### Acceso

Una vez hecho esto si acceden a [http://localhost]([http://localhost]) podrán ver la aplicación desplegada en local.

## Detener el servicio

Una vez se han visto todos los detalles de la aplicación y se quiera detener el servicio, simplmente hay que apagar los contenedores.

```bash
docker compose down
```

Además hay que ir a la terminar y pulsar `CTRL + C` para detener el servicio de Vite.

## Datos extra

Para este apartado es necesario haber recibido un archivo .zip por parte del creador de la aplicación con los detalles relevantes para comprobar de manera correcta la aplicación. Una vez obtenido simplemente habrá que abrir el archivo **[README](./README-acceso.md)**.

## Acceso desde el navegador

Este proyecto está desplegado con Hostinger y VPS. La url de acceso es [ritmatiza.site](https://ritmatiza.site)