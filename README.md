# Kulobal Health Pharmacy

Order medications easily via WhatsApp - A React-based pharmacy ordering application.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and configure the build settings
4. Click "Deploy"

Or use the CLI:
```bash
npm i -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Import the repository in [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy"

Or drag and drop the `dist` folder to Netlify.

### Render

1. Create a new "Static Site" on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
4. Add redirect rule: `/* → /index.html` (Status: 200)

### Manual Hosting (Nginx, Apache, etc.)

1. Run `npm run build`
2. Upload the contents of `dist/` folder to your server
3. Configure your server to serve `index.html` for all routes (SPA fallback)

**Nginx example:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔧 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://kulobalhealth-backend-1.onrender.com/api/v1` |
| `VITE_APP_NAME` | Application name | `Kulobal Health Pharmacy` |

## 📁 Project Structure

```
├── public/           # Static assets
├── src/
│   ├── api/          # API services and configuration
│   ├── assets/       # Images, icons, etc.
│   ├── components/   # React components
│   ├── context/      # React context providers
│   ├── data/         # Static data files
│   ├── App.jsx       # Main app component
│   └── main.jsx      # App entry point
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
└── package.json      # Dependencies and scripts
```

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite 7** - Build tool
- **React Router 7** - Routing
- **TailwindCSS 4** - Styling
- **HeroUI** - Component library
- **Framer Motion** - Animations

## 📝 License

© 2026 Kulobal Health. All rights reserved.
