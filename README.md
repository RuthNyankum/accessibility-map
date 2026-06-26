<div align="center">

<img src="https://img.shields.io/badge/Made%20in-Ghana%20🇬🇭-006B3F?style=for-the-badge" alt="Made in Ghana" />
&nbsp;
<img src="https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge" alt="All Rights Reserved" />
&nbsp;
<img src="https://img.shields.io/badge/Accessibility-First-purple?style=for-the-badge" alt="Accessibility First" />

<br /><br />

# 🗺️ AbilityMap Ghana

**A single, accessible platform to find disability support services across Ghana.**

People with disabilities, caregivers, and professionals can search, explore, and contribute to a growing directory of rehabilitation and support services — all in one place.

<br />

[View Features](#-features) · [Tech Stack](#-tech-stack) · [Get Started](#-getting-started) · [API Overview](#-api-overview)

</div>

---

## 📌 The Problem

Finding disability support services in Ghana is harder than it should be. Information lives across organisations, social media pages, and word of mouth — scattered, inconsistent, and often inaccessible.

**AbilityMap Ghana changes that.**

| Challenge | What AbilityMap Ghana Does |
|---|---|
| Information is scattered | Brings everything into one searchable directory |
| Platforms aren't accessible | Built accessibility-first from the ground up |
| No central directory exists | A single place for all support service listings |
| Finding help takes too long | Fast search and filtering across regions and disability types |

---

## ✨ Features

### Core

- 🔍 **Search & filter** by keyword, region, and disability type
- 📋 **Detailed service pages** with contact info and descriptions
- 🗺️ **Interactive map** to explore services geographically
- ➕ **Add a Service** via a multi-step contributor form
- 🛡️ **Admin dashboard** for reviewing and managing submissions

### Accessibility

- 🔡 Adjustable font size
- 🌗 High contrast mode & dark mode
- 🔊 Text-to-speech / read-aloud support
- ⌨️ Keyboard-friendly navigation
- 🏷️ Semantic HTML and accessible, labelled forms

---

## 🛠️ Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)

**Security & Utilities**

![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white)
`bcryptjs` · `Helmet` · `express-rate-limit` · `Morgan`

---

## 📁 Project Structure

```
abilitymap-ghana/
├── client/        # React + Vite frontend
└── server/        # Express + MongoDB backend
```

---

## 📄 Pages

| Page | Description |
|---|---|
| **Home** | Landing page with search, featured services, and quick access to support |
| **Services** | Browse and filter all listed services |
| **Service Details** | Full information for a selected service |
| **Map** | Explore services geographically |
| **Add Service** | Contributor form for submitting new services |
| **Login / Register** | Authentication for contributors and admins |
| **Admin Dashboard** | Manage services, users, and submissions |

---

## 👥 User Roles

**🌐 Public User**
Browse services, search, filter, and view service details — no account needed.

**✏️ Contributor**
Submit new disability support services for review.

**🛡️ Admin**
Review submissions, approve or reject services, manage listings and users.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or later
- npm
- MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/your-username/abilitymap-ghana.git
cd abilitymap-ghana
```

### 2. Set up the client

```bash
cd client
npm install
npm run dev
```

> Runs at `http://localhost:3000`

### 3. Set up the server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

> Runs at `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔌 API Overview

### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Log in and receive a JWT
- `GET /auth/me` — Get the currently authenticated user

### Services
- `GET /services` — Get all approved services
- `GET /services/featured` — Get featured services
- `GET /services/:id` — Get a single service by ID
- `POST /services` — Submit a new service
- `PATCH /services/:id/approve` — Approve or reject a submission *(admin)*
- `PUT /services/:id` — Update a service *(admin)*
- `DELETE /services/:id` — Delete a service *(admin)*

---

## ♿ Accessibility Focus

Accessibility is a core product requirement at AbilityMap Ghana — not an afterthought.

> *"Inclusive design decisions made throughout the platform."*

- **Low vision support** — Readable typography, adjustable font sizing
- **Contrast & theme controls** — High contrast and dark mode options
- **Screen reader support** — Semantic structure and labelled interactions
- **Read-aloud** — Text-to-speech for users who benefit from audio

---

## 🔮 Future Improvements

- [ ] Real map integration with live service locations
- [ ] Geolocation support for "services near me"
- [ ] Full backend integration for all frontend data flows
- [ ] Local language support
- [ ] Service reviews and ratings
- [ ] Offline support / PWA features
- [ ] Analytics for service coverage and submission trends

---



## 📜 License

© 2026 Ruth. All rights reserved.

This project and its source code are proprietary. No part of this codebase may be copied, modified, distributed, or used without explicit written permission from the author.

---

<div align="center">

**AbilityMap Ghana** was created to make disability support services easier to find across Ghana, and to show how accessibility can be built into software from the very start.

*Made in Ghana, for Ghana. 🇬🇭*

</div>
