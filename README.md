# blueprintai

A React-based application that enables users to design, generate, and manage AI-powered blueprints through an intuitive interface. It provides user authentication, project organization, AI model integration for blueprint generation, real-time collaboration, version control, and export capabilities.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Architecture & Technology Stack](#architecture--technology-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running the Application](#running-the-application)  
5. [Usage Examples](#usage-examples)  
6. [Components](#components)  
7. [Project Structure](#project-structure)  
8. [Dependencies](#dependencies)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Acknowledgements](#acknowledgements)  

---

## Project Overview

BluePrint AI is a React application that allows users to:

- Sign up, log in, and manage their account.  
- Create and organize multiple blueprint projects.  
- Use AI models to generate and refine blueprint designs in real time.  
- Collaborate with others via WebSockets.  
- Track version history, roll back changes, and export designs as PDF/PNG.

---

## Features

- User Authentication (signup, login, password reset)  
- Dashboard with project list and search  
- Blueprint creation wizard with model selection  
- Interactive editor: parameter controls + canvas preview  
- AI-powered blueprint generation via backend API  
- Real-time collaboration with WebSockets  
- Version history and rollback  
- Export to PDF/PNG  
- User profile & settings (API key configuration)  
- Notifications and error handling  

---

## Architecture & Technology Stack

- **Frontend**  
  - React with functional components & Hooks  
  - Context API (authentication, user data, theme)  
  - React Router for navigation  
  - Material UI for design consistency  
  - Axios for REST API calls  
  - Socket.io-client for real-time collaboration  

- **Backend**  
  - Node.js + Express  
  - REST endpoints for authentication, project & blueprint management  
  - WebSocket (Socket.io) for collaboration sessions  
  - CI/CD via GitHub Actions  
  - Hosted on Vercel (frontend) & Heroku/AWS (backend)  

---

## Getting Started

### Prerequisites

- Node.js >= 14.x  
- npm or yarn  
- A backend API URL (with AI-generation endpoints)  
- WebSocket endpoint for collaboration  

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/blueprintai.git
cd blueprintai

# Install dependencies
npm install        # or yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```dotenv
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key   # if needed
```

### Running the Application

```bash
# Start in development mode
npm start

# Build for production
npm run build
```

---

## Usage Examples

1. **Sign Up / Log In**  
   Visit `http://localhost:3000/signup` or `/login`, enter credentials.  

2. **Create a New Blueprint Project**  
   - Click **New Project** on the dashboard  
   - Enter a project name and select AI model  
   - Confirm to open the BlueprintEditor  

3. **Generate Blueprint**  
   - Adjust parameters in the sidebar  
   - Click **Generate**  
   - Preview updates in real time  

4. **Collaborate**  
   - Share your session link with teammates  
   - Real-time edits appear via WebSocket  

5. **Version Control & Export**  
   - Open **Version History**, select or rollback versions  
   - Click **Export** and choose PDF or PNG  

---

## Components

Below is a list of key components/files and their purposes:

- **authcontext.js**  
  Provides auth state, login/signup/logout, password reset, and user context.

- **apiservice.js**  
  Centralized HTTP client (Axios) with auth header injection for all REST calls.

- **routes.js**  
  Defines frontend routes using React Router.

- **app.jsx / index.js**  
  Entry point and main `<App />` component: initializes router, contexts, theme.

- **theme.js**  
  Generates Material UI theme configuration (light/dark mode).

- **navbar.jsx**  
  Top navigation bar for primary sections and user actions.

- **sidebar.jsx**  
  Side navigation listing main app sections and user projects.

- **login.jsx / signup.jsx**  
  Forms for user authentication flows (signup currently needs implementation fixes).

- **dashboard.jsx**  
  Lists user projects with search and ?Create New? functionality.

- **blueprinteditor.jsx**  
  Combines `<ParameterControls />` and `<BlueprintCanvas />` with generate/save.

- **parametercontrols.jsx**  
  UI controls for adjusting AI model parameters.

- **blueprintcanvas.jsx**  
  Renders the blueprint preview and handles canvas interactions.

- **versionhistory.jsx**  
  Displays past versions, view or rollback.

- **index.html**  
  Single-page app container.

---

## Project Structure

```
blueprintai/
??? public/
?   ??? index.html
??? src/
?   ??? components/
?   ?   ??? authcontext.js
?   ?   ??? apiservice.js
?   ?   ??? navbar.jsx
?   ?   ??? sidebar.jsx
?   ?   ??? theme.js
?   ?   ??? login.jsx
?   ?   ??? signup.jsx
?   ?   ??? dashboard.jsx
?   ?   ??? blueprinteditor.jsx
?   ?   ??? parametercontrols.jsx
?   ?   ??? blueprintcanvas.jsx
?   ?   ??? versionhistory.jsx
?   ??? routes.js
?   ??? app.jsx
?   ??? index.js
??? .env
??? package.json
??? README.md
```

---

## Dependencies

- React  
- react-dom  
- react-router-dom  
- @mui/material (Material UI)  
- axios  
- socket.io-client  
- dotenv  

_Backend dependencies (if running locally)_  
- express  
- cors  
- socket.io  
- jsonwebtoken  
- bcrypt  

---

## Contributing

1. Fork the repository  
2. Create a new branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

Please follow the existing code style and write tests where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- Material UI  
- React community  
- Socket.io  
- Inspiration from various AI-driven design tools  

Enjoy building with BluePrint AI! ?