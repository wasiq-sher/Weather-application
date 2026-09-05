# Atmosphere AI — Production Deployment Guide

This guide outlines the step-by-step process of preparing, configuring, and deploying the Atmosphere AI weather application across a production-grade modern stack:
- **Frontend SPA**: Vercel or Netlify (Static Hosting)
- **Backend API**: Railway or Render (Containerized or Node Node.js Environment)
- **Database**: MongoDB Atlas (Cloud-hosted NoSQL)

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Local Development Setup](#1-local-development-setup)
3. [Environment Variables Reference](#2-environment-variables-reference)
4. [MongoDB Atlas Cloud Database Setup](#3-mongodb-atlas-cloud-database-setup)
5. [Weather API Setup](#4-weather-api-setup)
6. [AI API Setup (Gemini/OpenAI)](#5-ai-api-setup-geminiopenai)
7. [Frontend Deployment (Vercel)](#6-frontend-deployment-vercel)
8. [Backend Deployment (Railway or Render)](#7-backend-deployment-railway-or-render)
9. [Production Security Verification & Testing](#8-production-security-verification--testing)

---

## Architecture Overview

Atmosphere AI is engineered with a strict **Backend-Proxy Architecture**:
```
┌────────────────────────┐         Client Requests         ┌────────────────────────┐
│     Frontend Client    │ ──────────────────────────────> │     Backend API App    │
│  (Static Host: Vercel) │ <────────────────────────────── │   (Railway / Render)   │
└────────────────────────┘          JSON Responses         └───────────┬────────────┘
                                                                       │
                                                   ┌───────────────────┴───────────────────┐
                                                   ▼                                       ▼
                                       ┌────────────────────────┐              ┌────────────────────────┐
                                       │     MongoDB Atlas      │              │ Third-Party API Proxy  │
                                       │    (Cloud Database)    │              │  (Open-Meteo / Gemini) │
                                       └────────────────────────┘              └────────────────────────┘
```
This guarantees that **no API keys, private tokens, or database credentials are ever exposed in client-side code bundles**. 

---

## 1. Local Development Setup

To run the full stack locally with hot reloading and local MongoDB synchronization:

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher installed.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally (optional, otherwise use MongoDB Atlas).

### Clone and Workspace Initialization
1. In the project workspace, copy the `.env.example` templates to their active configurations:
   ```bash
   # In the root folder:
   cp .env.example .env

   # In the server sub-repo:
   cp atmosphere-ai/server/.env.example atmosphere-ai/server/.env

   # In the client sub-repo:
   cp atmosphere-ai/client/.env.example atmosphere-ai/client/.env
   ```

2. Run the development server (runs full frontend client proxying `/api` requests automatically to the backend on `localhost:5000`):
   ```bash
   # Install dependencies at the root
   npm install

   # Spin up the front-end dev server (Vite on http://localhost:3000)
   npm run dev
   ```

3. Spin up the backend Express engine:
   ```bash
   # Navigate to the server folder
   cd atmosphere-ai/server
   npm install
   
   # Start with live reloading
   npm run dev
   ```

---

## 2. Environment Variables Reference

Never commit `.env` files to git. Create your local keys based on the following configurations:

### Server-Side Variables (Configure on Railway/Render)
These environment variables are kept exclusively on the server and are hidden from browser clients.

| Variable Name | Description | Example / Default Value | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | The port the Express application binds to. | `5000` | Yes (Render/Railway set this automatically) |
| `NODE_ENV` | Environment identifier. | `production` | Yes |
| `CLIENT_URL` | The URL of your deployed frontend. Used to authorize CORS origins. | `https://atmosphere-ai.vercel.app` | Yes |
| `MONGODB_URI` | Connection string for MongoDB database instance. | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens. | `use-a-32-char-randomly-generated-key` | Yes |
| `JWT_EXPIRES_IN` | Time limit before a session token expires. | `7d` | No |
| `WEATHER_PROVIDER` | Selection for meteorological data processor. | `real` (Open-Meteo) or `openweathermap` | No |
| `GEMINI_API_KEY` | Google Gemini AI Key used to power the Assistant card. | `AIzaSy...` | No (Falls back to local rules engine) |
| `OPENAI_API_KEY` | Alternative OpenAI Key used for AI insights. | `sk-proj-...` | No |
| `OPENWEATHER_API_KEY` | Private key to power OpenWeatherMap premium feeds. | `your-owm-api-key` | No |
| `OPENMETEO_API_KEY`| Commercial key for high-volume Open-Meteo lookups. | `your-om-key` | No |

### Client-Side Variables (Configure on Vercel)
These variables are baked into the frontend build at compilation time. All client-side variables **must** be prefixed with `VITE_`.

| Variable Name | Description | Example / Default Value | Required |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The production URL of your backend Express API. | `https://atmosphere-ai-backend.up.railway.app/api` | Yes |
| `VITE_APP_NAME` | Display name of the application. | `Atmosphere AI` | No |
| `VITE_MAP_PROVIDER` | Selected map engine to render overlays. | `leaflet` | No |

---

## 3. MongoDB Atlas Cloud Database Setup

Follow these steps to set up a managed, auto-scaling MongoDB Database in the cloud for free:

1. **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and register for a free account.
2. **Deploy Free Cluster**: Click **Create a Deployment**, select the **M0 Shared Free Tier**, select your preferred cloud provider (AWS, GCP, or Azure), and pick a close geographic region.
3. **Database User Credentials**: 
   - Under **Database Access**, create a new database user.
   - Choose **Password** Authentication, create a username (e.g., `atmosphere_admin`), and generate a secure password.
4. **Network IP Whitelisting**:
   - Under **Network Access**, click **Add IP Address**.
   - For simple serverless/PaaS hosting (where backend IPs recycle frequently), select **Allow Access From Anywhere** (`0.0.0.0/0`). Alternatively, if using a static server, whitelist only the explicit public IP of your backend host.
5. **Get the Connection URI**:
   - Go back to the **Database** dashboard and click **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the connection string. It will look like this:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/atmosphere_ai?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the credentials you created in Step 3. Set this string as your `MONGODB_URI` environment variable.

---

## 4. Weather API Setup

Atmosphere AI features a robust data fallback strategy, operating out-of-the-box using the free Open-Meteo API. For advanced coverage:

### Open-Meteo API (Default)
- No registration required. Out of the box, the system queries the public endpoint of Open-Meteo.
- For high-volume production loads (greater than 10,000 requests/day), obtain a commercial key from [Open-Meteo](https://open-meteo.com/) and define `OPENMETEO_API_KEY`.

### OpenWeatherMap (Optional Expansion)
- Register at [OpenWeatherMap Portal](https://openweathermap.org/api) to get a free API Key.
- Configure `WEATHER_PROVIDER=openweathermap` and add your `OPENWEATHER_API_KEY` to your backend environment variables.

---

## 5. AI API Setup (Gemini/OpenAI)

Enable the conversational micro-meteorology dashboard widgets:

### Gemini AI (Recommended)
1. Navigate to the [Google AI Studio Console](https://aistudio.google.com/).
2. Create or select a project, then click **Get API Key**.
3. Copy the key and define `GEMINI_API_KEY` on your backend. The system will dynamically utilize Gemini models to provide clothes suggestions, humidity, and pressure feedback.

### OpenAI (Alternative)
1. Go to the [OpenAI Platform Dashboard](https://platform.openai.com/api-keys).
2. Generate a new secret key.
3. Define `OPENAI_API_KEY` on your backend.

---

## 6. Frontend Deployment (Vercel)

Vercel is the recommended environment for compiling and distributing the React client bundle.

1. **Sign In**: Go to [Vercel](https://vercel.com/) and connect your GitHub/GitLab account.
2. **Import Repo**: Click **Add New** > **Project** and import your Atmosphere AI repository.
3. **Configure Project Overrides**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `atmosphere-ai/client` (Click edit and point to the subfolder if the repository contains both client and server)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - Add `VITE_API_BASE_URL` with your production backend API URL (e.g. `https://atmosphere-ai-api.up.railway.app/api`).
   - Add `VITE_APP_NAME` = `Atmosphere AI`
5. **Deploy**: Click **Deploy**. Vercel will build the static assets, optimize images, and host them on a high-availability CDN.

---

## 7. Backend Deployment (Railway or Render)

### Option A: Railway (Highly Recommended)
Railway parses and spins up Express backends instantly with zero setup files.

1. Create a [Railway Account](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your repository. 
4. Select the server directory path as the root target by going to **Settings** > **General** > **Root Directory** and changing it to `atmosphere-ai/server`.
5. Under **Variables**, add all of the required server-side environment variables described in Section 2:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (Set this to your Vercel URL, e.g., `https://atmosphere-ai.vercel.app`)
   - `NODE_ENV` = `production`
6. Railway will automatically bind to the dynamic `PORT` and build and start the server using the `npm start` script in `package.json`.

---

### Option B: Render
1. Register at [Render](https://render.com/).
2. Click **New +** > **Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
   - **Name**: `atmosphere-ai-api`
   - **Environment**: `Node`
   - **Root Directory**: `atmosphere-ai/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** and add your Environment Variables.
6. Click **Create Web Service**.

---

## 8. Production Security Verification & Testing

Verify that your systems are properly hardened and optimized:

1. **Inspect CORS Policies**:
   - Try to query your backend API from an unauthorized domain using a tool like Postman or Curl:
     ```bash
     curl -H "Origin: https://unauthorized-domain.com" https://your-backend-api.com/api/health
     ```
   - The response should securely block the request with a CORS policy error.
2. **Check Auth Tokens**:
   - Access a protected route like `/api/locations` without supplying an `Authorization` header.
   - The API should respond with status `401 Unauthorized`.
3. **Validate Database Leak Protection**:
   - Perform a registration request. Check your MongoDB Atlas cluster collections to verify that passwords have been securely hashed with standard salt rounds using `bcryptjs`.
4. **Radar Offline Performance**:
   - Toggle the client map to Radar view. Toggle timeline sweeps. The client should load historical scans seamlessly via the RainViewer CDN without stressing your API server.
