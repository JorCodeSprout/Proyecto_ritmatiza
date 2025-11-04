# 🚀 Guía Completa de Pruebas de API para RITMATIZA (Postman)

Esta guía detalla las pruebas necesarias para verificar cada endpoint de tu aplicación **Laravel**, asegurando la correcta **autenticación y autorización (roles)** antes de la integración con el frontend.

**URL Base:**  
[http://ritmatiza.local:8000/api](http://ritmatiza.local:8000/api)


---

## 🧩 1. Preparación y Variables

Necesitarás tokens para al menos **dos roles** para probar las autorizaciones:

- **Estudiante (o Usuario Normal)**: Para rutas generales y sugerencias.  
- **Administrador**: Para rutas de configuración de Spotify y añadir canciones a la playlist.

### A. Variables de Entorno en Postman

Después de los pasos 1.1 y 1.2, guarda los siguientes valores como variables de entorno:

| Variable         | Rol        | Descripción                                                |
|------------------|------------|------------------------------------------------------------|
| `admin_token`    | Admin      | JWT del usuario con rol admin.                             |
| `estudiante_token` | Estudiante | JWT del usuario con rol estudiante.                        |
| `tarea_id`       | N/A        | ID de una Tarea existente (obtenido en 2.2).               |
| `entrega_id`     | N/A        | ID de una Entrega para calificar (obtenido en 2.3).        |

---

## 🔐 2. Flujo de Autenticación (Auth)

### 1.1. Registro de Administrador (Setup)
**Endpoint:** `/register`  
**Método:** `POST`

**Cuerpo (JSON):**
```json
{
  "name": "Admin Uno",
  "email": "admin@test.com",
  "password": "password",
  "role": "admin"
}
````

**Resultado Esperado:** `201 Created`

> Guarda el `access_token` como `admin_token`.

---

### 1.2. Registro de Estudiante (Setup)

**Endpoint:** `/register`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "name": "Estudiante Uno",
  "email": "estudiante@test.com",
  "password": "password",
  "role": "estudiante"
}
```

**Resultado Esperado:** `201 Created`

> Guarda el `access_token` como `estudiante_token`.

---

### 1.3. Obtener Usuario Actual

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/me`
**Método:** `GET`

**Resultado Esperado:** `200 OK`

> Devuelve los datos del usuario **Admin**.

---

### 1.4. Logout (Opcional)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/logout`
**Método:** `POST`

**Resultado Esperado:** `200 OK`

---

## 🧾 3. Flujo de Tareas y Entregas

### 2.1. Crear Tarea (Rol: Admin)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/tareas`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "titulo": "Proyecto 1: Diseño Web",
  "descripcion": "Crear landing page con Tailwind.",
  "recompensa": 50,
  "reenviar": true
}
```

**Resultado Esperado:** `201 Created`

---

### 2.2. Listar Todas las Tareas (Rol: Cualquiera)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/tareas`
**Método:** `GET`

**Resultado Esperado:** `200 OK`

> Guarda el `id` de la tarea creada en `tarea_id`.

---

### 2.3. Entregar Tarea (Rol: Estudiante)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/tareas/{{tarea_id}}/entregar`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "ruta": "https://github.com/usuario/entrega-tarea-1"
}
```

**Resultado Esperado:** `201 Created`

> Guarda el `id` de la entrega como `entrega_id`.

---

### 2.4. Ver Entregas por Tarea (Rol: Admin)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/tareas/{{tarea_id}}/entregas`
**Método:** `GET`

**Resultado Esperado:** `200 OK`

> Debe incluir la entrega creada en 2.3.

---

### 2.5. Calificar Entrega (Rol: Admin)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/tareas/entregas/{{entrega_id}}/calificar`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "estado": "APROBADA"
}
```

**Resultado Esperado:** `200 OK`

> El campo `estado` debe ser `APROBADA`.

---

### 2.6. Ver Mis Entregas (Rol: Estudiante)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/tareas/mis-entregas`
**Método:** `GET`

**Resultado Esperado:** `200 OK`

> Devuelve la entrega con estado `APROBADA`.

---

## 🎵 4. Flujo de Música

### 3.1. Buscar Canción en Spotify (Rol: Cualquiera)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/musica/buscar-spotify`
**Método:** `GET`

**Query Params:**
`q=Muse Uprising`

**Resultado Esperado:** `200 OK`

> Devuelve resultados de búsqueda de Spotify.

---

### 3.2. Sugerir Canción (Rol: Estudiante)

**Header:** `Authorization: Bearer {{estudiante_token}}`
**Endpoint:** `/musica/sugerir`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "id_spotify_cancion": "7mLsW9Gv4MvI9j1mXF1G1u",
  "titulo": "Thriller",
  "artista": "Michael Jackson"
}
```

**Resultado Esperado:** `201 Created`

---

### 3.3. Listado de Sugerencias (Rol: Admin)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/musica/sugerencias`
**Método:** `GET`

**Resultado Esperado:** `200 OK`

> Incluye la sugerencia creada en 3.2.

---

## 🛠️ 5. Administración de Spotify (Solo Admin)

Todas las siguientes rutas requieren `admin_token`.

---

### 4.1. Iniciar Flujo OAuth (Spotify)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/spotify/redirect`
**Método:** `POST`

**Resultado Esperado:** `200 OK`

> Devuelve:

```json
{
  "auth_url": "https://accounts.spotify.com/authorize?..."
}
```

Copia la URL devuelta.

---

### 4.2. Autorización en Navegador (Acción Externa)

Pega la `auth_url` en un navegador y autoriza la aplicación.

> Spotify te redirigirá a tu `redirect_uri`, por ejemplo:

```
http://ritmatiza.local:8000/api/spotify/callback?code=...&state=...
```

---

### 4.3. Finalizar Callback (Spotify)

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/spotify/callback`
**Método:** `GET`

**Query Params:**
`code=[EL CÓDIGO DE LA URL]`
`state=[EL STATE DE LA URL]`

**Resultado Esperado:** `200 OK`

> Los tokens de Spotify se han guardado correctamente.

---

### 4.4. Añadir Canción a Playlist

**Header:** `Authorization: Bearer {{admin_token}}`
**Endpoint:** `/playlist/add`
**Método:** `POST`

**Cuerpo (JSON):**

```json
{
  "id_spotify_cancion": "2Z84S2fJzF2mK1i2R5m6Gk"
}
```

**Resultado Esperado:** `200 OK`

> La canción fue añadida correctamente (requiere token activo de Spotify Admin).

---

✅ **Fin de la Guía**
Esta documentación permite validar cada flujo principal de la API: autenticación, tareas, entregas, música y administración de Spotify.

```

---

¿Quieres que también te genere una **colección .json de Postman lista para importar** con todos estos endpoints y variables? Puedo armarla automáticamente.
```
