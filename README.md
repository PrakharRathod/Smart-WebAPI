# Smart WebAPI
**Multiple APIs, One Smart Platform**

## Project Overview
Smart WebAPI is a beginner-friendly React project that demonstrates how multiple external APIs can be integrated into a single responsive web application. It serves as an excellent demonstration of core React concepts like component architecture, state management, routing, and data fetching.

## Objectives
This project demonstrates:
* **Multiple API integration** (Weather, News, Currency, Images, Users)
* **React development** using functional components and hooks
* **Routing** with React Router DOM
* **API fetching** using the native Browser Fetch API
* **Search and Filtering** based on user input
* **Location detection** using Browser Geolocation API
* **Responsive design** for mobile, tablet, and desktop
* **Dark/Light mode** toggling with persistent state

## Technologies Used
* **React**: A JavaScript library for building user interfaces.
* **Vite**: A fast build tool and development server.
* **JavaScript**: The core programming language used.
* **Tailwind CSS v4**: A utility-first CSS framework for rapid UI styling without manual CSS files.
* **React Router DOM**: For navigating between different pages.
* **Lucide React**: For beautiful, consistent SVG icons.
* **Fetch API**: For making HTTP requests to external APIs natively.

---

## Installation

Follow these steps to run the project locally:

1. Clone or download the repository.
2. Open the terminal and navigate to the project folder (`smart-webapi`).
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local development URL provided in the terminal (usually `http://localhost:5173`) in your browser.

---

## API Configuration

**Great news!** This project has been updated to use 100% free, open-source APIs that do not require any API keys. You no longer need an `.env` file to run this project. Just install the dependencies and start the server!

APIs used in this project:
- **Weather**: Open-Meteo API
- **News**: Spaceflight News API
- **Currency**: Frankfurter API
- **Images**: NASA Image API
- **Users**: Random User Generator API

---

## Feature Documentation

### Weather
* **Location Detection**: When the home or weather page loads, it asks the browser for geolocation permission. If granted, it fetches the weather for your current coordinates.
* **Search**: You can manually search for any city.
* **API Flow**: The app makes a request to OpenWeatherMap API using `fetch()`. The JSON response is saved in React state and displayed on the UI.

### News
* **Default News**: Fetches latest technology news on load.
* **Search**: You can search for specific topics.
* **API**: Uses NewsAPI. Displays images, headlines, and a link to read the original article.

### Currency
* **Conversion**: Convert amounts between different global currencies.
* **API**: Uses the Frankfurter API (no key required) to get real-time exchange rates.
* **Swap**: You can quickly swap the "From" and "To" currencies.

### Unsplash
* **Image Search**: Enter a keyword to find high-quality images.
* **Grid**: Displays results in a responsive grid.
* **API**: Uses Unsplash API. Shows photographer details and provides links to download or view the original image.

### Random User
* **Generation**: Generates a random realistic user profile.
* **API**: Uses Random User Generator API (no key required).
* **Details**: Displays picture, name, email, phone, location, and age.

---

## React Concepts Demonstrated

### `useState`
Used extensively to store changing data like search inputs, API responses (weather data, news articles), loading indicators, and error messages.

### `useEffect`
Used to trigger API calls as soon as a component renders (e.g., fetching default news, or asking for geolocation on mount), and for reading the saved theme from `localStorage`.

### `fetch()`
The native browser method used in every page to communicate with external APIs and retrieve JSON data.

### Props
Used to pass data from parent components to child components (e.g., passing `icon`, `title`, and `description` to the `FeatureCard` component).

### React Router
Used in `App.jsx` to define routes (`/`, `/weather`, `/news`, etc.) so the user can navigate without the page reloading.

### Conditional Rendering
Used to display different UI states:
* `<Loading />` while waiting for the API.
* `<ErrorMessage />` if the fetch fails.
* The actual data if the fetch succeeds.

### `.map()`
Used to loop through arrays of data (like lists of news articles or images) and render multiple React elements dynamically.

### localStorage
Used to save the user's preference for Light or Dark mode, so the app remembers it even if the page is refreshed.

---

## Overall Application Flow

```text
User interacts with UI (e.g. types city name)
 ↓
Smart WebAPI updates React State
 ↓
User clicks Search -> fetch() makes API Request
 ↓
External API processes request
 ↓
JSON Response is returned
 ↓
React State is updated with new data
 ↓
UI Re-renders to display the information
```

---

## Folder Structure

```text
smart-webapi/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── FeatureCard.jsx
│   │
│   ├── pages/             # Main application pages
│   │   ├── Home.jsx
│   │   ├── Weather.jsx
│   │   ├── News.jsx
│   │   ├── Currency.jsx
│   │   ├── Unsplash.jsx
│   │   └── RandomUser.jsx
│   │
│   ├── App.jsx            # Routing and Theme logic
│   ├── main.jsx           # React application entry point
│   └── index.css          # Tailwind CSS v4 setup and base styles
│
├── .env                   # API Keys (create this)
├── .env.example           # Example API keys template
└── package.json           # Dependencies and scripts
```

---

## Troubleshooting

* **API key missing/Invalid API key**: Ensure you have created the `.env` file correctly, added valid keys, and restarted the Vite server.
* **CORS problems / NewsAPI fails**: If using NewsAPI on the free tier, it may block requests from non-localhost domains in production. For local college demonstrations, it will work fine.
* **Location permission denied**: The Weather page will show an error or fallback to a default city. You can still use the manual search.
* **.env changes not reflecting**: You must stop (`Ctrl+C`) and restart (`npm run dev`) the terminal for Vite to pick up new environment variables.
* **Page refresh routing issues**: When deploying to services like Vercel or Netlify, you may need to configure fallback rewrites for React Router. Locally, Vite handles this automatically.
