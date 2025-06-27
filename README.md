# Grupos Comunitarios - Frontend

Este frontend permite registrar personas que retiran raciones en grupos comunitarios, verificando si ya están registradas y asociándolas a un hogar o grupo.

## 🔧 Tecnologías utilizadas

- [Next.js 14 (App Router)](https://nextjs.org/)
- React
- TypeScript
- TailwindCSS
- Fetch API

## 🚀 Funcionalidades

- Registro de personas con validación por número de documento.
- Verificación en tiempo real si ya existe la persona registrada.
- Asociación de personas a un grupo comunitario (`hogar`).
- Formulario dinámico e interactivo.

## 📁 Estructura principal

- `/app/registro/page.tsx` – Página principal del formulario de registro.
- `lib/prisma.ts` – Conexión al backend via API (desde el frontend).
- `api/personas` y `api/hogares` – Rutas del backend que consume.

---

## 🖥️ Instrucciones para desarrollo local

### 1. Clonar el repositorio

```bash
git clone https://github.com/sanpoletti/grupos-comunitarios-front.git
cd grupos-comunitarios-front

2. Instalar dependencias
npm install

3. Configurar variables de entorno (si aplica)
Crear un archivo .env.local si necesitás apuntar a un backend diferente:
Editar
NEXT_PUBLIC_API_URL=http://localhost:3000
Por defecto el frontend asume que el backend corre en el mismo host (localhost:3000).

4. Ejecutar el servidor de desarrollo

npm run dev
npm run dev -- -p3001

La aplicación estará disponible en http://localhost:3001 si usás un puerto distinto (o el por defecto si no configuraste nada).

📝 Registro de persona
El formulario permite ingresar:

Tipo y número de documento (con validación y búsqueda)

Nombre y apellido (en mayúsculas)

Sexo

Fecha de nacimiento

Lugar de residencia

Cantidad de raciones

Grupo comunitario (hogar) – desplegable cargado desde la API

🧑‍💻 Autoría
Proyecto desarrollado por Sandra Poletti junto al equipo de Grupos Comunitarios del Gobierno de la Ciudad de Buenos Aires.


