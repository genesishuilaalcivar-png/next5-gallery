# Guía de Configuración - Galería de Imágenes

## Requisitos Previos

- Node.js 18+
- npm o pnpm
- Cuenta en Vercel
- Cuenta en Supabase

## Paso 1: Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve al SQL Editor y ejecuta el script en `supabase/sql/create_tables.sql`
3. Obtén las credenciales:
   - Project URL: Settings → API → Project URL
   - Anon Public Key: Settings → API → anon public
   - Service Role Key: Settings → API → service_role (mantener secreto)

## Paso 2: Configurar Vercel Blob

1. Ve a tu proyecto en Vercel
2. Navega a Storage → Create Database → Vercel Blob → Create
3. Una vez creado, obtén el token de lectura/escritura en Storage → Blob → .env.local

## Paso 3: Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y completa con tus credenciales:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

## Paso 4: Instalar Dependencias

```bash
npm install
```

## Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Paso 6: Desplegar a Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel (mismas que .env.local)
3. Haz deploy

### Variables de Entorno en Vercel

Asegúrate de agregar estas variables en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOB_READ_WRITE_TOKEN`

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── images/          # Endpoints CRUD para imágenes
│   │   └── upload/          # Endpoint para subir/eliminar archivos
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal (galería)
├── components/
│   ├── gallery/             # Componentes de galería
│   │   ├── ImageCard.tsx    # Tarjeta de imagen individual
│   │   └── ImageForm.tsx    # Formulario para crear/editar
│   └── ui/                  # Componentes UI reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Textarea.tsx
│       └── LoadingSpinner.tsx
└── lib/
    ├── blob.ts              # Funciones para Vercel Blob
    └── supabase/
        ├── client.ts        # Cliente de Supabase
        └── types.ts         # Tipos TypeScript
```

## Características

- ✅ Galería de imágenes en grid de 4 columnas
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Subida de imágenes a Vercel Blob
- ✅ Búsqueda por título de imagen
- ✅ Modals para crear/editar
- ✅ Notificaciones Toast
- ✅ Animaciones y loading states
- ✅ Responsive design
- ✅ Dark mode ready

## Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **Supabase** - Base de datos PostgreSQL
- **Vercel Blob** - Almacenamiento de imágenes
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones