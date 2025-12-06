WeatherDash is a modern, multi-city weather dashboard designed for people who need to track weather across multiple locations simultaneously. Perfect for remote workers, digital nomads, travelers, and anyone with family or business in different cities.

Why WeatherDash?
Stop app juggling: See all your cities in one beautiful dashboard

Smart comparisons: AI-powered insights about weather differences

Travel planning: Compare destinations before you book

Privacy first: No data selling, minimal ads

🚀 Key Features
🌍 Multi-City Dashboard
Unlimited cities (premium) or 3 cities (free tier)

Grid/List views with customizable layouts

Color-coded temperatures for quick visual scanning

Drag & drop city reordering

Quick add with smart search

📊 Smart Weather Comparison
Side-by-side comparisons of 2-5 cities

Temperature differences with color indicators

Weather score system (0-100) for travel planning

Historical trend visualization (premium)

Export comparisons as shareable images

🤖 AI-Powered Insights
Natural language insights: "New York is 15°F colder than LA today—pack a jacket!"

Travel recommendations: Best time to visit based on weather preferences

Anomaly detection: "Unusual weather pattern detected in Chicago"

Proactive alerts: Severe weather warnings for saved cities

🎨 Beautiful Visualization
Animated weather icons (sun, clouds, rain, snow)

Temperature gradient maps across cities

Dark/Light themes with system preference detection

Custom weather backgrounds (premium)

Data visualization with interactive charts

🔔 Smart Notifications
Severe weather alerts for saved locations

Weather-triggered suggestions (Uber when raining, outdoor activities when sunny)

Family alerts: Get notified when weather affects loved ones

Travel alerts: Weather changes for upcoming trips

💾 Data & Privacy
LocalStorage caching for offline viewing

Privacy-first approach: No data selling, minimal tracking

Anonymous mode: Use without account creation

Data export: CSV export of weather history (premium)

API transparency: Clear data source attribution

🛠️ Technology Stack
Core Framework
React 18 - Modern React with concurrent features

TypeScript - Full type safety for reliable weather data

Vite - Lightning fast build and development

State & Data
Zustand - Lightweight state management

OpenWeatherMap API - Reliable global weather data

Google Gemini API - AI-powered weather insights

LocalStorage API - Client-side data persistence

UI & Styling
Tailwind CSS - Utility-first CSS framework

Framer Motion - Smooth weather animations

Recharts - Weather data visualization

Lucide React - Weather-themed icons

React Hot Toast - Weather alerts and notifications

APIs & Integrations
OpenWeatherMap API - Primary weather data source

WeatherAPI.com - Fallback/secondary API

Google Gemini API - AI insights generation

Geolocation API - Automatic location detection

Clipboard API - Share weather comparisons

📁 Project Structure
text
weatherdash/
├── src/
│   ├── components/
│   │   ├── weather/       # Weather cards, forecasts, maps
│   │   ├── dashboard/     # Dashboard layout, city grid
│   │   ├── charts/        # Temperature charts, data viz
│   │   ├── insights/      # AI insights, recommendations
│   │   ├── common/        # UI components
│   │   └── layout/        # Header, sidebar, layout
│   ├── pages/
│   │   ├── DashboardPage.tsx     # Main dashboard view
│   │   ├── ComparePage.tsx       # City comparison
│   │   ├── TravelPlanPage.tsx    # Travel planning
│   │   ├── AnalyticsPage.tsx     # Weather analytics
│   │   └── SettingsPage.tsx      # User preferences
│   ├── services/
│   │   ├── weatherApi.ts         # OpenWeatherMap service
│   │   ├── aiService.ts          # Gemini API integration
│   │   ├── cacheService.ts       # LocalStorage caching
│   │   └── notificationService.ts# Weather alerts
│   ├── store/
│   │   ├── weatherStore.ts       # Weather data state
│   │   ├── cityStore.ts          # City management
│   │   ├── userStore.ts          # User preferences
│   │   └── uiStore.ts            # UI state
│   ├── types/
│   │   ├── weather.ts            # Weather data types
│   │   ├── city.ts               # City/location types
│   │   └── api.ts                # API response types
│   ├── utils/
│   │   ├── weatherUtils.ts       # Weather calculations
│   │   ├── comparisonUtils.ts    # City comparison logic
│   │   ├── dateUtils.ts          # Date/time formatting
│   │   └── validationUtils.ts    # Input validation
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
└── package.json
🚀 Getting Started
Prerequisites
Node.js 18 or higher

OpenWeatherMap API key (free tier available)

Google Gemini API key (optional for AI features)

Installation
Clone the repository

bash
git clone https://github.com/yourusername/weatherdash.git
cd weatherdash
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env
Edit .env file:

env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_APP_URL=http://localhost:5173
Start development server

bash
npm run dev
Open your browser
Navigate to http://localhost:5173

Building for Production
bash
# Create production build
npm run build

# Preview production build locally
npm run preview
📱 Pages & Features
🌐 Main Dashboard (/)
City Grid View: Visual layout of all saved cities

Temperature Overview: Color-coded quick glance

Search & Add: Add new cities with autocomplete

Layout Controls: Grid/list view, sorting options

📊 Compare Cities (/compare)
Side-by-side Comparison: Compare 2-5 cities

Weather Score: Rate locations based on preferences

Historical Comparison: View trends over time

Export Options: Share as image or link

✈️ Travel Planning (/travel)
Date-based Forecasts: Compare cities for specific dates

Weather Preferences: Set preferences (sun, snow, mild)

Recommendation Engine: AI suggests best destinations

Itinerary Integration: Weather-aware travel planning

📈 Analytics (/analytics)
Temperature Trends: Historical temperature charts

Climate Patterns: Seasonal weather analysis

Export Data: Download weather data as CSV

Custom Reports: Generate weather reports

⚙️ Settings (/settings)
Unit Preferences: °C/°F, km/h/mph

Theme Settings: Dark/light mode, custom colors

Notification Settings: Weather alert preferences

API Configuration: Manage API keys and data sources

🔧 Configuration
API Keys Required
OpenWeatherMap API Key (Required)

Get from: https://openweathermap.org/api

Free tier: 1,000 calls/day

Google Gemini API Key (Optional for AI features)

Get from: https://makersuite.google.com/app/apikey

Free tier available

WeatherAPI.com Key (Optional fallback)

Get from: https://www.weatherapi.com/

1M calls/month free

Browser Support
✅ Chrome 90+

✅ Firefox 88+

✅ Safari 14+

✅ Edge 90+

✅ Mobile browsers

🎨 Customization
Themes
Light/Dark Mode: Automatic system detection

Weather Themes: Different themes for seasons

Custom Colors: User-defined color schemes

Backgrounds: Weather-appropriate backgrounds

Units & Preferences
Temperature: °C, °F, K

Wind Speed: km/h, mph, m/s, knots

Precipitation: mm, inches

Pressure: hPa, mmHg, inHg

🤝 Contributing
Fork the repository

Create a feature branch

bash
git checkout -b feature/amazing-feature
Commit your changes

bash
git commit -m 'Add some amazing feature'
Push to the branch

bash
git push origin feature/amazing-feature
Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Write meaningful commit messages

Add tests for new features

Update documentation

Follow existing code style

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
OpenWeatherMap for weather data API

Google Gemini for AI capabilities

React Team for the amazing framework

Tailwind CSS for the utility-first approach

All contributors who help improve WeatherDash

📞 Support
Issues: GitHub Issues

Email: your-email@example.com

Twitter: @weatherdash

🚀 Deployment
Vercel (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Netlify
bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
GitHub Pages
bash
npm run build
# Upload /dist folder to GitHub Pages
🎯 Who is WeatherDash For?
Digital Nomads
Track weather across potential next destinations

Remote Workers
Monitor weather for family in different cities

Travel Planners
Compare weather for upcoming trips

Climate Enthusiasts
Analyze weather patterns and trends

Business Travelers
Prepare for weather in different business locations

Made with ❤️ for people who care about weather across cities

⭐ Star this repo if you find it useful! ⭐

