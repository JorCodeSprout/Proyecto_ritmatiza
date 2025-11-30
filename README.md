# 🎵 RITMATIZA - Gamificación del aprendizaje

## Introducción

Ritmatiza es un proyecto que comenzó como una manera de motivar a los estudiantes a que se esfuercen en realizar las tareas. Esta aplicación consiste en un servicio de entrega de trabajos para obtener puntos, para posteriormente gastarlos en la solicitud de canciones para solicitar que pongan su canción favorita en los recreos.

## Despliegue

Este proyecto utiliza contenedores de Docker para servir los servicios, y su despliegue es bastante sencillo:

### Prerrequisitos

Asegúrate de tener instalado Git, Docker y Docker Compose.

### Pasos a seguir - Windows

#### Clonar repositorio

```bash
git clone https://github.com/JorCodeSprout/Proyecto_ritmatiza.git

cd Proyecto_ritmatiza
```

#### Script de inicio

Simplemente ejecutando el siguiente script en la terminal hará que se levante los contenedores, ajustará los permisos de Laravel y ejecutará el servidor de desarrollo en Vite. 

```bash
./start.bat
```

### Pasos a seguir - Linux/macOS

#### Clonar repositorio

```bash
git clone https://github.com/JorCodeSprout/Proyecto_ritmatiza.git

cd Proyecto_ritmatiza
```

#### Levantar contenedores

Dado que el `start.bat` está previsto para usuarios en Windows, en Linux y macOS el proceso es un poco más tedioso. Una vez en el directorio del respositorio tendremos que ejecutar el siguiente comando para levantar los contenedores:

```bash
docker compose up --build -d

docker compose ps  # Para asegurarnos que los contenedores están correctamente levantados
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

### Acceso

Una vez hecho esto si acceden a [http://localhost]([http://localhost]) podrán ver la aplicación desplegada en local.

## Detener el servicio

Una vez se han visto todos los detalles de la aplicación y se quiera detener el servicio, simplmente hay que apagar los contenedores.

```bash
docker compose down
```

Además hay que ir a la terminar y pulsar `CTRL + C` para detener el servicio de Vite en caso de Linux/macOS o simplemente cerrar la ventana de terminal donde se ejecutó el `start.bat` en Windows.

## Datos extra

Para este apartado es necesario haber recibido un archivo .zip por parte del creador de la aplicación con los detalles relevantes para comprobar de manera correcta la aplicación. Una vez obtenido simplemente habrá que abrir el archivo **[README](./README-acceso.md)**.