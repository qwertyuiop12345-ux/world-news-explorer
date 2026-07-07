# 🌍 World News Explorer

A premium interactive world news application built with Next.js, TypeScript, and Tailwind CSS. Explore global news by clicking on countries on an interactive map.

## ✨ Features

- **Interactive World Map** - Zoom, pan, and explore countries with smooth animations
- **Real-time News** - Get the latest headlines from NewsAPI
- **Category Filtering** - Browse news by Politics, Business, Technology, Sports, Entertainment, Science, and Health
- **Beautiful UI** - Premium design with glassmorphism, gradients, and smooth animations
- **Dark Mode** - Toggle between light and dark themes
- **Search** - Quickly find and navigate to any country
- **Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Country Information** - View detailed information about any country including:
  - Capital city
  - Population
  - Currency
  - Languages
  - Government type
  - Timezone
  - Area

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- NewsAPI key (get one free at [https://newsapi.org](https://newsapi.org))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd geonews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your NewsAPI key:
   ```env
   NEXT_PUBLIC_NEWS_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=World News Explorer
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
geonews/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Common components (Loading, Error)
│   │   ├── layout/       # Layout components (Header, etc.)
│   │   └── ui/           # UI primitives (Button, Card, Badge)
│   ├── features/         # Feature-based modules
│   │   ├── map/          # Map-related components
│   │   │   └── components/
│   │   │       ├── WorldMap.tsx
│   │   │       └── CountryTooltip.tsx
│   │   └── news/         # News-related components
│   │       └── components/
│   │           ├── CountryPanel.tsx
│   │           ├── NewsCard.tsx
│   │           └── NewsFilter.tsx
│   ├── context/          # React Context providers
│   │   └── AppContext.tsx
│   ├── data/             # Static data and constants
│   │   └── countries.ts  # Country information
│   ├── services/         # API services
│   │   └── newsApi.ts    # NewsAPI integration
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── public/               # Static assets
│   └── world-110m.json   # World map GeoJSON
├── .env.local            # Environment variables (create this)
└── package.json          # Dependencies
```

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** React Simple Maps
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **API:** NewsAPI

## 📝 Key Components

### WorldMap
- Interactive SVG world map
- Zoom and pan functionality
- Country hover effects with tooltips
- Click to select country

### CountryPanel
- Slides in from the right
- Shows country information
- Displays categorized news
- Smooth animations

### Header
- Global search for countries
- Dark mode toggle
- Responsive design

### NewsCard
- Beautiful card design
- Article image, title, description
- Published date and source
- Read more button

## 🎯 Features Breakdown

### Map Interactions
- **Hover:** See country info in tooltip
- **Click:** Open detailed country panel with news
- **Zoom:** Use scroll or zoom buttons
- **Pan:** Drag the map around

### News Categories
- Top Headlines
- Politics
- Business
- Technology
- Sports
- Entertainment
- Science
- Health

### Search
- Type any country name
- Auto-complete suggestions
- Click to zoom and open panel

## 🌐 API Integration

This app uses [NewsAPI](https://newsapi.org) to fetch news articles. The API provides:
- Top headlines by country
- Category filtering
- Search functionality
- Article metadata

**Note:** The free tier has some limitations. Consider upgrading for production use.

## 🎨 Design Philosophy

This application combines design elements from:
- **Apple** - Clean, minimalist interface
- **Google Earth** - Interactive map exploration
- **Bloomberg** - Professional news presentation

Key design features:
- Glassmorphism effects
- Smooth animations
- Gradient accents
- Dark mode support
- Premium color palette

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy:

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the .next folder to Netlify
```

### Environment Variables

Don't forget to add your environment variables in your deployment platform:
- `NEXT_PUBLIC_NEWS_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

## 📱 Mobile Support

The application is fully responsive:
- **Desktop:** Side panel layout
- **Tablet:** Adaptive layout
- **Mobile:** Full-screen panels with overlay

## 🔧 Configuration

### Adding More Countries

Edit `src/data/countries.ts` to add more countries with their data.

### Customizing Theme

Edit `src/app/globals.css` to customize colors and effects.

### Adding News Sources

Modify `src/services/newsApi.ts` to add more API integrations.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
