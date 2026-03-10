# Klassik Car — Dashboard de Control Digital v2.0

Dashboard interactivo para el equipo de gerencia de Klassik Car (concesionario automotriz). Consolidación de métricas digitales, calidad de leads, rendimiento de canales, ventas por vendedor y estado de conexiones.

## Pestañas

| Tab | Contenido |
|-----|-----------|
| Vista General | KPIs principales, funnel de ventas, leads por semana, alertas |
| Calidad de Leads | Clasificación HOT/WARM/COLD/BASURA, lead scoring, estrategias anti-basura |
| Canales | Google Ads, Instagram, Email — rendimiento y costo por canal |
| Vendedores | Rendimiento individual, metas mensuales editables, proyección de cierre |
| Conexiones | Estado de APIs integradas (GA4, Meta, CRM, etc.) y dificultad de setup |

## Stack

- **Frontend:** HTML + CSS + Chart.js 4.4.1 (single-page, cero frameworks)
- **Backend:** Express.js (servidor estático)
- **Container:** Docker (Alpine Node 18)
- **Deploy:** Google Cloud Run

---

## Guía de Migración Paso a Paso

### 1. Requisitos previos

```bash
# Instalar Node.js 18+ (https://nodejs.org)
node --version   # debe ser >= 18

# Instalar Docker (https://docs.docker.com/get-docker/)
docker --version

# Instalar gcloud CLI (https://cloud.google.com/sdk/docs/install)
gcloud --version

# Instalar Git
git --version
```

### 2. Probar localmente

```bash
# Instalar dependencias
npm install

# Arrancar el servidor
npm start

# Abrir en el navegador
# http://localhost:8080
```

### 3. Probar con Docker localmente

```bash
# Construir la imagen
docker build -t klassik-dashboard .

# Correr el contenedor
docker run -p 8080:8080 klassik-dashboard

# Abrir http://localhost:8080
```

### 4. Subir a GitHub

```bash
# Inicializar repo
git init
git add .
git commit -m "feat: dashboard Klassik Car v2.0 con 5 pestañas"

# Crear repo en GitHub (necesitas gh CLI o hacerlo desde github.com)
gh repo create klassik-car-dashboard --private --source=. --push

# O manualmente:
git remote add origin https://github.com/TU_USUARIO/klassik-car-dashboard.git
git branch -M main
git push -u origin main
```

### 5. Deploy a Google Cloud Run

#### Opción A: Deploy manual (una vez)

```bash
# 1. Autenticarse
gcloud auth login

# 2. Crear proyecto (si no existe)
gcloud projects create klassik-car-dashboard --name="Klassik Dashboard"
gcloud config set project klassik-car-dashboard

# 3. Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 4. Ejecutar el script de deploy
chmod +x deploy.sh
./deploy.sh
```

#### Opción B: CI/CD automático (cada push a main)

Para que cada `git push` al branch `main` haga deploy automáticamente:

1. **Crear una Service Account en GCP:**
```bash
# Crear SA
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Deploy"

# Dar permisos
PROJECT_ID=$(gcloud config get-value project)
SA_EMAIL="github-deploy@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Generar key JSON
gcloud iam service-accounts keys create key.json \
  --iam-account="${SA_EMAIL}"
```

2. **Configurar secrets en GitHub:**
   - Ve a tu repo → Settings → Secrets and variables → Actions
   - Agrega `GCP_PROJECT_ID` con el ID de tu proyecto
   - Agrega `GCP_SA_KEY` con el contenido del archivo `key.json`
   - **Elimina** el archivo `key.json` de tu máquina (no lo subas al repo)

3. **Push y listo:**
```bash
git push origin main
# El workflow de GitHub Actions construye y despliega automáticamente
```

---

## Estructura del proyecto

```
klassik-car-dashboard/
├── public/
│   └── index.html          ← Dashboard (HTML + CSS + JS todo-en-uno)
├── src/
│   └── server.js           ← Servidor Express (estático + health check)
├── .github/
│   └── workflows/
│       └── deploy.yml      ← CI/CD GitHub Actions → Cloud Run
├── Dockerfile              ← Container para Cloud Run
├── .dockerignore
├── .gitignore
├── deploy.sh               ← Script de deploy manual
├── package.json
└── README.md               ← Este archivo
```

## Costos estimados en Google Cloud Run

| Concepto | Costo |
|----------|-------|
| Cloud Run (free tier) | **$0/mes** hasta ~2M requests |
| Cloud Build | **$0/mes** (120 min gratis/día) |
| Container Registry | ~$0.10/mes |
| **Total estimado** | **< $1 USD/mes** |

Cloud Run solo cobra cuando hay tráfico (min-instances=0). Para un dashboard interno con pocos usuarios, el costo es prácticamente cero.

## Próximos pasos (roadmap técnico)

1. **Conectar datos reales** — Reemplazar datos hardcodeados por API calls a GA4, Meta, CRM
2. **Autenticación** — Agregar login con Google (Firebase Auth) para proteger el dashboard
3. **Base de datos** — Firestore o PostgreSQL para persistir metas de vendedores
4. **Notificaciones** — Alertas por email/WhatsApp cuando un KPI baja del umbral
