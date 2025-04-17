# Financial Report Generator

A React-based web application that helps generate financial reports using Google Drive integration.

## Features

- Google OAuth2 Authentication
- Protected Routes
- Dashboard Interface
- Google Drive Integration
- TypeScript Support
- Modern React with Hooks

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Project with OAuth 2.0 credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_PROJECT_ID=your_google_project_id
VITE_GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
VITE_GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
VITE_GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create and configure the `.env` file as described above
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Google OAuth2
- Google Drive API

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── contexts/       # React contexts
  ├── pages/          # Page components
  ├── services/       # API services
  ├── styles/         # CSS styles
  └── config/         # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
