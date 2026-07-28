# 🌤️ Weather App

A beautiful, production-quality desktop weather application built with **Electron**, **React**, **TypeScript**, and **Vite**. Features real-time weather data, air quality monitoring, city search, and a stunning glassmorphism UI with adaptive gradients.

## ✨ Features

- **Current Weather** — Temperature, humidity, wind, pressure, visibility, UV index, cloud cover, feels like
- **Hourly Forecast** — Scrollable 24-hour forecast with temperature and rain probability
- **7-Day Forecast** — Daily highs, lows, and weather conditions
- **Air Quality** — European AQI with PM2.5, PM10, CO, NO₂, SO₂, O₃
- **City Search** — Debounced autocomplete search with Open-Meteo Geocoding API
- **GPS Location** — Auto-detect location with fallback to manual search
- **Favorites & Recent** — Save favorite cities and view recent searches
- **Offline Mode** — Caches latest weather data, displays when offline
- **Unit Toggle** — Celsius/Fahrenheit, km/h ↔ mph, persisted in localStorage
- **Themes** — Light, Dark, and System theme with smooth transitions
- **Animations** — Framer Motion powered card animations, page transitions, loading states
- **Adaptive Gradients** — Background colors change based on weather conditions
- **Glassmorphism UI** — Rounded cards with blur effects and semi-transparent backgrounds
- **Responsive** — Minimum 1000×700 window, resizable with remembered size

## 📸 Screenshots

*Screenshots coming soon*

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/joyboy64209/weatherApp.git
cd weatherApp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Electron Development

```bash
# Start Electron with hot reload
npm run electron:dev
```

### Production Build

```bash
# Build the application
npm run build

# Build Windows executable
npm run electron:build
```

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| **Electron** | Desktop application framework |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **TailwindCSS 3** | Utility-first CSS |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with retry logic |
| **TanStack Query 5** | Server state management & caching |
| **Zustand** | Client state management |
| **Framer Motion 12** | Animations |
| **Lucide React** | Icons |
| **Open-Meteo API** | Free weather data (no API key required) |

## 📁 Project Structure

```
weatherApp/
├── electron/
│   ├── main.ts              # Electron main process
│   └── preload.ts           # Context bridge
├── src/
│   ├── api/                 # Axios HTTP clients
│   │   ├── client.ts        # Base client with retry/error handling
│   │   ├── weatherApi.ts    # Open-Meteo forecast API
│   │   ├── geocodingApi.ts  # Geocoding & reverse geocoding
│   │   └── airQualityApi.ts # Air Quality API
│   ├── components/
│   │   ├── layout/          # Header, navigation
│   │   ├── search/          # SearchBar with autocomplete
│   │   ├── ui/              # Skeleton, ErrorDisplay, OfflineBanner
│   │   └── weather/         # CurrentWeather, HourlyForecast, DailyForecast, AirQuality, WeatherIcon
│   ├── constants/           # Weather codes, defaults, API URLs
│   ├── hooks/               # useDebounce, useGeolocation, useWeather, useTheme
│   ├── layouts/             # MainLayout with router outlet
│   ├── pages/               # HomePage, SettingsPage
│   ├── services/            # Business logic (weather, cache, settings)
│   ├── store/               # Zustand stores (settings, search)
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Temperature, wind speed, time formatters
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 📡 API Documentation

This app uses the **Open-Meteo API** — completely free, no API key required.

| Endpoint | URL | Usage |
|---|---|---|
| **Geocoding** | `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=10` | Search cities |
| **Reverse Geocoding** | `https://geocoding-api.open-meteo.com/v1/search?name={lat},{lon}&count=1` | GPS → city name |
| **Weather Forecast** | `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...&hourly=...&daily=...` | Current + forecast data |
| **Air Quality** | `https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=...` | AQI and pollutants |

## 🔧 Configuration

Settings are persisted in `localStorage` and include:

- **Theme**: Light, Dark, or System
- **Temperature**: Celsius or Fahrenheit
- **Wind Speed**: km/h or mph
- **Auto Location**: Enable/disable GPS detection
- **Refresh Interval**: 1m, 5m, 15m, 30m, 1h
- **Cache Duration**: 5m, 15m, 30m, 1h, 2h

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 🚧 Future Improvements

- [ ] Hourly precipitation chart
- [ ] Weather alerts and notifications
- [ ] Multiple location tabs
- [ ] Weather maps overlay
- [ ] Export weather data
- [ ] System tray integration
- [ ] Auto-updater
- [ ] macOS and Linux builds

## 📄 License

MIT