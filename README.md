# 👗 Wardrobe AI - Your Personal Style Assistant

A modern, AI-powered wardrobe management app built with **React 19**, **Vite**, **Tailwind CSS**, and **Google Gemini AI**. Get personalized outfit suggestions, manage your clothing inventory, and discover what's missing from your wardrobe.

![Wardrobe AI](https://img.shields.io/badge/React-19.2.6-61dafb) ![Vite](https://img.shields.io/badge/Vite-8.0.14-646cff) ![Tailwind](https://img.shields.io/badge/Tailwind-4.3.0-38b2ac) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Phase 1: Style Identity
- **Interactive Onboarding** - 6-question conversational flow to understand your style
- **Style Card** - Beautiful profile card displaying your unique style identity
- **Profile Editor** - Edit and refine your style preferences anytime

### Phase 2: Wardrobe Manager
- **Digital Closet** - Organize and catalog all your clothing items
- **Photo Scanning** - Upload photos and AI automatically extracts item details
- **Smart Filtering** - Filter by category, color, occasion, and more
- **Wear Tracking** - Track how often you wear each item
- **Analytics Dashboard** - View wardrobe statistics and insights

### Phase 3: AI Stylist Agent
- **Daily Outfit Suggestions** - Get 3 personalized outfit recommendations for today
- **Stylist Chat** - Have a freeform conversation with your AI fashion consultant
- **Event Dressing** - Get specific outfit recommendations for special occasions
- **Context Aware** - Suggestions consider weather, mood, and your schedule

### Phase 4: Shopping Expert
- **Gap Analysis** - Identify missing pieces in your wardrobe
- **Smart Recommendations** - Get product suggestions that match your style
- **Priority Planning** - See high, medium, and low priority gaps
- **Budget Aware** - Recommendations respect your budget preferences

### Phase 5: Polish & Ship
- **Loading States** - Smooth skeleton screens while data loads
- **Error Handling** - Comprehensive error boundary and recovery UI
- **Smooth Animations** - Delightful transitions and interactions
- **Performance Optimized** - Fast load times and smooth interactions

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (check with `node --version`)
- **npm** or **yarn**
- **Google Gemini API Key** (free tier available at [ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wardrobe-ai.git
cd wardrobe-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Gemini API key
# VITE_GEMINI_API_KEY=your_actual_api_key_here
```

4. **Start the dev server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app will hot-reload as you edit!

## 📖 Usage Guide

### 1. Create Your Style Profile
- Navigate to the **Profile** tab
- Answer 6 questions about your style (vibes, fit, colors, occasions, budget)
- AI generates your unique style persona
- Save and view your beautiful style card

### 2. Build Your Digital Wardrobe
- Go to the **Wardrobe** tab
- Click **+ Add Item** to add clothing
- **Option A:** Fill in details manually
- **Option B:** Use **📸 Photo Scanner** to upload a photo (AI extracts details)
- View your wardrobe grid with all items and analytics

### 3. Get Daily Outfit Suggestions
- Visit the **Today** tab
- Click **🔍 Generate Outfits** to get 3 personalized looks
- Chat with your **AI Stylist** for styling advice
- Ask for outfit recommendations for specific events

### 4. Discover Shopping Gaps
- Go to the **Shop** tab
- Click **🔍 Analyze My Gaps** to identify missing pieces
- Select a gap to see product recommendations
- Get 3-5 specific product suggestions that match your style

## 🛠️ Development

### Available Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── shared/         # Navbar, Toast, ErrorBoundary, Skeletons
│   ├── StyleID/        # Profile onboarding and editing
│   ├── Wardrobe/       # Inventory management and photo scanning
│   ├── Shopping/       # Gap analysis and recommendations
│   └── Stylist/        # Daily outfits and chat
├── hooks/              # Custom React hooks
│   ├── useProfile.js   # Profile state management
│   ├── useWardrobe.js  # Wardrobe CRUD and analytics
│   └── useShopping.js  # Shopping expert logic
├── pages/              # Page components for routing
├── lib/               # Utilities and helpers
│   ├── ai.js          # Gemini API wrapper
│   ├── storage.js     # localStorage abstraction
│   └── prompts.js     # AI system prompts
├── data/              # Constants and schemas
│   └── defaults.js    # Enums, styles, data structures
└── styles/            # Global styles and animations
```

### Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI library |
| Vite | 8.0.14 | Build tool & dev server |
| React Router DOM | 7.15.1 | Client-side routing |
| Tailwind CSS | 4.3.0 | Styling framework |
| Google Generative AI | 0.19.0 | AI model integration |

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Google Gemini API Key (get from https://ai.google.dev)
VITE_GEMINI_API_KEY=your_api_key_here
```

**Note:** Never commit `.env` to version control. Use `.env.example` for documentation.

## 📊 Data Persistence

All data is stored locally using browser `localStorage`:
- **Profile** - Style preferences, persona, vibes
- **Wardrobe** - Item inventory with metadata
- **Daily Outfits** - Saved outfit suggestions

No server or database required for local use!

## 🎨 Customization

### Styling
- Edit CSS files in each component folder
- Global styles in `src/styles/`
- CSS variables defined in `index.css` for colors and theme

### Prompts
Edit AI prompts in `src/lib/prompts.js`:
- Onboarding questions
- Photo scanning
- Outfit recommendations
- Shopping suggestions

### Data Schemas
Modify constants in `src/data/defaults.js`:
- Clothing categories and subcategories
- Style vibes and fit preferences
- Occasions and seasons
- Color palettes and budgets

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Set `VITE_GEMINI_API_KEY` as an environment variable in Vercel
4. Deploy with one click!

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag & drop the 'dist' folder to Netlify
# Set VITE_GEMINI_API_KEY in Site Settings → Environment
```

### Deploy to GitHub Pages

```bash
# Update vite.config.js base property
# Then run: npm run build
# Push the dist folder to gh-pages branch
```

## 📝 API Reference

### Gemini Integration
The app uses Google's Gemini 2.0 Flash model for:
- **Text Generation** - Outfit suggestions, styling advice, persona creation
- **Vision** - Photo analysis and clothing detection
- **Streaming** - Real-time chat responses

See `src/lib/ai.js` for implementation details.

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Gemini API returns 429 (quota exceeded)
- You're using the free tier quota limit
- Wait for quota reset (usually within 1 minute)
- Consider upgrading to paid plan for higher limits

### Issue: Photo Scanner not working
- Check browser supports File API and Canvas
- Ensure image is < 5MB
- Supported formats: JPG, PNG, WebP, GIF

### Issue: Data not persisting
- Check browser allows localStorage
- Try clearing cache: `localStorage.clear()` in DevTools
- Ensure not using private/incognito mode

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙌 Credits

Built with ❤️ using:
- React & Vite for blazing fast development
- Tailwind CSS for beautiful styling
- Google Gemini AI for intelligent suggestions
- localStorage for seamless data persistence

## 📧 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting guide above

---

**Happy Styling! 👗✨**
