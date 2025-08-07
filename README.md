# COD Zombie Game

A fully featured COD zombie game built with Vue.js frontend and NestJS backend.

## Tech Stack

### Frontend
- Vue 3 with TypeScript
- Pinia for state management
- Vue Router
- Socket.IO client
- Tres.js (Three.js wrapper for Vue)
- Rapier.js for physics

### Backend
- NestJS
- Socket.IO
- Rapier.js for physics simulation

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run start:dev
```
Server will run on http://localhost:3001

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### Development Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Type checking

#### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
zombie-nest/
├── frontend/           # Vue.js frontend
│   ├── src/
│   │   ├── components/ # Vue components
│   │   ├── views/      # Vue views/pages
│   │   ├── stores/     # Pinia stores
│   │   └── composables/# Vue composables
├── backend/            # NestJS backend
│   └── src/
│       ├── game/       # Game logic and physics
│       └── websocket/  # Socket.IO gateway
```

## Features (To Be Implemented)

- Real-time multiplayer gameplay
- 3D graphics with Three.js
- Physics simulation with Rapier.js
- Zombie AI and spawning
- Player movement and shooting
- Score tracking
- Multiple game modes