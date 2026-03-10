#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Klassik Car Dashboard — Deploy to Google Cloud Run
# ═══════════════════════════════════════════════════════════
#
# Uso:  ./deploy.sh
#
# Requisitos previos:
#   1. gcloud CLI instalado (https://cloud.google.com/sdk/docs/install)
#   2. Estar autenticado: gcloud auth login
#   3. Tener un proyecto de GCP creado
#
# ═══════════════════════════════════════════════════════════

set -euo pipefail

# ─── CONFIGURACIÓN (editar según tu proyecto) ───
PROJECT_ID="${GCP_PROJECT_ID:-klassik-car-dashboard}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="klassik-dashboard"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "═══════════════════════════════════════════════════════"
echo "  Klassik Car Dashboard — Deploy a Cloud Run"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Proyecto:  ${PROJECT_ID}"
echo "  Región:    ${REGION}"
echo "  Servicio:  ${SERVICE_NAME}"
echo ""

# ─── PASO 1: Configurar proyecto ───
echo "▶ Configurando proyecto GCP..."
gcloud config set project "${PROJECT_ID}"

# ─── PASO 2: Build & Push con Cloud Build ───
echo "▶ Construyendo imagen Docker con Cloud Build..."
gcloud builds submit --tag "${IMAGE_NAME}" .

# ─── PASO 3: Deploy a Cloud Run ───
echo "▶ Desplegando a Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}" \
  --platform managed \
  --region "${REGION}" \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production"

# ─── PASO 4: Obtener URL ───
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ Deploy exitoso!"
URL=$(gcloud run services describe "${SERVICE_NAME}" --region "${REGION}" --format 'value(status.url)')
echo "  🌐 URL: ${URL}"
echo "═══════════════════════════════════════════════════════"
