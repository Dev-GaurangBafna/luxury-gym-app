# 🏆 Luxury Gym App

> **Premium fitness tracking with royal design - Your personal luxury fitness companion**

A comprehensive, all-in-one fitness application built with React Native and Expo, featuring nutrition tracking, workout logging, progress analytics, and AI-powered coaching with a stunning royal design system.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.12-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### 🍽️ **Nutrition Tracking**
- **Barcode Scanner**: Real-time barcode scanning with camera integration
- **Open Food Facts API**: Access to 1M+ food products worldwide
- **Meal Diary**: Track breakfast, lunch, dinner, and snacks
- **Macro Tracking**: Real-time protein, carbs, and fat progress
- **Smart Search**: Intelligent food search with autocomplete
- **Offline Support**: Local caching for instant re-scanning

### 🏋️ **Workout Logging**
- **Exercise Library**: Pre-loaded with popular exercises
- **Smart Logging**: Sets, reps, weight, and RPE tracking
- **Rest Timer**: Animated countdown timer between sets
- **Workout Templates**: Save and reuse favorite routines
- **Real-time Duration**: Track workout time automatically
- **PR Detection**: Automatic personal record identification

### 📈 **Progress Analytics**
- **Beautiful Charts**: Custom SVG charts with smooth animations
- **Body Measurements**: Weight, body fat, and measurement tracking
- **Strength Progress**: Exercise-specific progress visualization
- **Personal Records**: Golden badges for achievements
- **Trend Analysis**: Historical data with insights

### 🤖 **AI Assistant**
- **Smart Chat**: Personalized fitness and nutrition coaching
- **Quick Actions**: Pre-built prompts for common questions
- **Contextual Advice**: Responses based on your actual data
- **24/7 Support**: Always available fitness guidance

### 🏠 **Dynamic Dashboard**
- **Real-time Insights**: Live data from your activities
- **Smart Greetings**: Time-based personalized messages
- **Progress Rings**: Beautiful circular progress indicators
- **Quick Actions**: One-tap logging for weight and meals
- **AI Insights**: Personalized daily recommendations

## 🎨 Design System

### **Royal Theme**
- **Primary**: Royal Purple `#4B0082`
- **Secondary**: Deep Navy `#0D0D2B`
- **Background**: Onyx Black `#121212`
- **Accent**: Gold Gradient `#FFD700 → #FFB347`
- **Success**: Emerald Green `#50C878`

### **Premium UI Elements**
- **Glassmorphism**: Frosted glass effects throughout
- **Smooth Animations**: React Native Reanimated for butter-smooth interactions
- **Luxury Typography**: Modern sans-serif with perfect spacing
- **Golden Highlights**: Premium accents on achievements and active elements
- **Rounded Corners**: 28-32px radius for modern feel

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.8.0 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dev-GaurangBafna/luxury-gym-app.git
   cd luxury-gym-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

### Running the App

#### 📱 **On Your Phone (Recommended)**
1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Scan the QR code from the terminal
3. Enjoy the full mobile experience with camera features

#### 🖥️ **iOS Simulator**
```bash
expo start --ios
```

#### 🤖 **Android Emulator**
```bash
expo start --android
```

#### 🌐 **Web Browser**
```bash
expo start --web
```
*Note: Camera features won't work in web version*

## 📱 Screenshots

*Coming soon - Add screenshots of your beautiful app here*

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Hooks
- **Animations**: React Native Reanimated
- **Charts**: Custom SVG with react-native-svg
- **API**: Open Food Facts REST API
- **Storage**: Local SQLite + MMKV for preferences

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components
│   └── BarcodeScanner.tsx
├── constants/          # Theme and configuration
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # App screens
├── services/           # API and database services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Configuration

### **Environment Setup**
The app works out of the box with no additional configuration needed. All data is stored locally using SQLite.

### **API Integration**
- **Open Food Facts**: No API key required
- **AI Assistant**: Ready for OpenAI integration (add your API key)

## 🎯 Key Features Walkthrough

### **First Time Setup**
1. App initializes SQLite database automatically
2. Pre-loads exercise library with popular exercises
3. Ready to use immediately - no account required

### **Nutrition Tracking Flow**
1. Tap "Scan Barcode" → Camera opens with animated scanner
2. Scan any food product → Fetches from Open Food Facts
3. Adjust quantity → Select meal → Add to diary
4. Watch macro progress bars update in real-time

### **Workout Logging Flow**
1. Tap "Start Workout" → Timer begins
2. Add exercises from searchable library
3. Log sets with weight/reps → Rest timer starts automatically
4. Complete workout → View summary and PRs

### **Progress Tracking**
1. Log weight via Quick Log → Instant chart update
2. View strength progress → Beautiful trend visualization
3. Check personal records → Golden achievement badges

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Food Facts** for the comprehensive food database
- **Expo Team** for the amazing development platform
- **React Native Community** for the powerful framework
- **Lucide Icons** for the beautiful icon set

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Dev-GaurangBafna/luxury-gym-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dev-GaurangBafna/luxury-gym-app/discussions)

---

<div align="center">

**Built with ❤️ and ☕ for fitness enthusiasts worldwide**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
