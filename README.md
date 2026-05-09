# CS497-Fronted

## Botnoi Chat Interface

A beautiful and dynamic web application for interacting with the Botnoi custom channel. 
This project is built with React, Vite, and Tailwind CSS. It serves as both the frontend UI and an Express backend proxy to communicate securely with Botnoi.

### Environment Setup
Create a `.env` file or set the following variables in your hosting environment (like Vercel or Render):
- `BOTNOI_BOT_ID`: Your Botnoi Bot ID (e.g. `69ff88c4fb3079f00791405c`)
- `BOTNOI_SECRET`: Your Botnoi Custom Channel Secret Key

### How to Run Locally
1. Run `npm install` to install dependencies.
2. Run `npm run dev:all` to start both the React frontend and the Express backend simultaneously.
3. Access the frontend at `http://localhost:5173`.

### Deployment
- **Frontend**: Can be deployed to Vercel (choose Vite template, build command: `npm run build`, output: `dist`).
- **Backend**: Can be deployed to Render.com using this same repository as a Web Service.
