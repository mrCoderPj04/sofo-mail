<div align="center">

```
  ██████╗  ██████╗ ███████╗ ██████╗ ███╗   ███╗ █████╗ ██╗██╗     
  ██╔══██╗██╔═══██╗██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║██║     
  ██████╔╝██║   ██║█████╗  ██║   ██║██╔████╔██║███████║██║██║     
  ██╔═══╝ ██║   ██║██╔══╝  ██║   ██║██║╚██╔╝██║██╔══██║██║██║     
  ██║     ╚██████╔╝██║     ╚██████╔╝██║ ╚═╝ ██║██║  ██║██║███████╗
  ╚═╝      ╚═════╝ ╚═╝      ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
```

# 📬 PJSOFONIC SOFOMail — Frontend Client
### Modern Angular 19 Enterprise Webmail Interface

[![Angular](https://img.shields.io/badge/Angular-19.1.0-red.svg?style=flat&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Nginx](https://img.shields.io/badge/Nginx-Alpine-brightgreen.svg?style=flat&logo=nginx)](https://nginx.org)
[![Deployment](https://img.shields.io/badge/Deploy-Render-46E3B7.svg?style=flat&logo=render)](https://render.com/)

The **SOFOMail Frontend Client** is a responsive, high-performance webmail application built with **Angular 19** standalone architecture, reactive signals, custom scannable 2FA Authenticator pairing, real-time EMS corporate directory synchronization, and modern WCAG AAA compliant design themes.

---

</div>

## 🌟 Frontend Features

- **🔐 Dedicated EMS SSO Login**: Clean login interface exclusively requiring PJSOFONIC EMS employee ID/Email and password.
- **📧 Corporate Mailbox Provisioning**: Interactive screen allowing employees to customize their email handle prefix (`[custom.handle]@pjsofonic.com`) with 1-click clipboard copying.
- **📱 Real High-Contrast 2FA QR Code**: Generates clear, scannable QR codes for **Google Authenticator**, **Microsoft Authenticator**, and **Apple Keychain**.
- **👥 Real-Time Corporate Directory**: Searchable employee directory syncing directly with live EMS records.
- **👤 Profile Management with Security Locks**: Edit personal details while EMS Employee ID and Corporate Email remain permanently locked.
- **📜 Smooth Global Scrolling**: Native fluid scrolling across desktop, tablet, and mobile browsers.
- **🎨 Multi-Theme Support**: Instant switching between Enterprise Dark and Corporate Light themes.

---

## 🏗️ Frontend Tech Stack

- **Framework**: Angular 19.1 (Standalone Components & Signals)
- **Language**: TypeScript 5.7
- **Styling**: Modern SCSS with 8px Design Token scale
- **Production Server**: Nginx Alpine with SPA HTML5 fallback routing & Gzip compression
- **Icons**: Lucide Angular icons & custom enterprise SVG vector assets

---

## ⚙️ Environment Configuration

Set your backend API endpoint in `src/environments/environment.prod.ts` or via window runtime injection:

```typescript
export const environment = {
  production: true,
  // Point to your live Render backend URL:
  apiBaseUrl: (typeof window !== 'undefined' && (window as any).__SOFOMAIL_API_URL__) || 'https://sofomail-backend.onrender.com/api/v1',
  emsBackendUrl: 'https://erp-backend-1-02lc.onrender.com'
};
```

---

## 🚀 Render Cloud Deployment

### Step 1: Push Frontend to its Git Repository
```bash
git remote add origin https://github.com/mrCoderPj04/sofo-mail.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** → **Web Service** (or **Static Site**).
3. Select your frontend Git repository.
4. Set:
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
5. Click **Create Web Service** to launch!

---

## 💻 Local Development Setup

```bash
# Install NPM dependencies
npm install

# Start Local Dev Server with proxy to backend
npm start
```
- Web Application: `http://localhost:4200/`

---

<div align="center">

**Developed with ❤️ for PJSOFONIC Enterprises**  
*Corporate Communications & Information Security Division*

</div>
