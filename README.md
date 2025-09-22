# Time Sensei - Trading Time Tracker

A sophisticated trading time tracker application designed for forex/financial market traders following ICT (Inner Circle Trader) methodology.

## 🚀 Live Demo

Visit the live application: [https://khsawan.github.io/time-sensei-42/](https://khsawan.github.io/time-sensei-42/)

## Features

- **Traffic Light Trading System**: Visual indicators for optimal trading times
- **ICT Macro Tracking**: 8 daily macro sessions for precise entry timing  
- **Killzone Monitoring**: London and New York killzone periods
- **Real-time Timeline**: Interactive 24-hour visualization of all trading periods
- **Beirut Time Zone**: All sessions calibrated to GMT+2
- **News Event Alerts**: High-impact news event notifications
- **Customizable Settings**: Adjustable trading parameters

## Project info

**URL**: https://lovable.dev/projects/b87d150d-5387-4d5b-8e43-c448ff700afb

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment happens on every push to the main branch.

### Manual Deployment Steps

If you need to deploy manually:

1. **Build for production:**
   ```sh
   npm run build:gh-pages
   ```

2. **Deploy the `dist` folder to GitHub Pages**

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section  
3. Set source to "GitHub Actions"
4. The site will be available at `https://khsawan.github.io/time-sensei-42/`

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b87d150d-5387-4d5b-8e43-c448ff700afb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
