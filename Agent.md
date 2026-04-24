# Agent.md — Let's Date Again (LDA) AI Agent Guide

## 🎯 Purpose

This agent is responsible for building and maintaining "Let's Date Again" (LDA), a premium relationship wellness app for Indian couples. The MVP is a solo 5-day guided experience built with React Native CLI.

---

## 🧠 Core Responsibilities

### 1. Code Quality & Consistency
* **TypeScript First**: Always use strict typing.
* **Feature-Based Architecture**: Organize code by days and shared modules.
* **Production Grade**: Build for scale, even for the solo MVP.

### 2. High-Fidelity UX
* **Immersive Flow**: Day screens must be full-screen with no navigation bars.
* **Micro-interactions**: Use `react-native-reanimated` and `react-native-gesture-handler` for fluid transitions.
* **Haptics**: Implement `react-native-haptic-feedback` for all meaningful interactions.

---

## ⚙️ LDA Tech Stack

* **Core**: React Native CLI, TypeScript
* **Navigation**: `@react-navigation/native` v6 (Stack only, no tabs)
* **State**: `Zustand` + `Immer` middleware
* **Storage**: 
    * `react-native-mmkv` (Fast global state persistence)
    * `AsyncStorage` (Large objects: journal entries, memories)
* **Styling**: `Tailwind` (NativeWind) + Centralized `theme/`
* **Animations**: `react-native-reanimated` v3, `Lottie`
* **Features**: `react-native-svg`, `react-native-linear-gradient`, `react-native-share`, `react-native-view-shot`

---

## 📦 Project Structure

Follow the **Feature-First** organization in `src/`:

```
src/
 ├── assets/          # Fonts (Playfair Display, Inter), Lottie, Images
 ├── components/
 │    ├── common/     # ProgressStrip, StreakRing, MoodCard
 │    ├── day1/       # SparkQuiz, ConnectionSlider
 │    └── ...         # Components for Days 2-5
 ├── data/            # Static JSON content database
 ├── navigation/      # RootNavigator, DayNavigator, DayRouter logic
 ├── screens/         # One folder per day + bridges + onboarding
 ├── services/        # badgeCalculator, storage, letterGenerator
 ├── store/           # Zustand stores (useUserStore, useDayStore)
 ├── theme/           # tokens (colors, typography, spacing)
 └── utils/           # haptics, personalityCalculator
```

---

## 🔁 Navigation & State Rules

* **Linear Flow**: The app is a progressive experience. Never use bottom tabs.
* **DayRouter Service**: On every launch, the logic must resolve the first incomplete day/bridge and route accordingly.
* **Offline-First**: The MVP is 100% offline. Logic runs client-side; local functions must be easily swappable for future API calls.

---

## 🎨 Design & Interaction Rules

* **Playfair Display**: Use for all key emotional moments and large numbers. **Italic** is the brand voice.
* **Progress Awareness**: Every day screen MUST include the 5-pip `ProgressStrip`.
* **CTA Intent**: Use emotionally resonant copy for buttons (e.g., "That's my number" instead of "Next").
* **Continuity**: Use shared element transitions or number "landing" animations between screens (e.g., D1 Slider to Honest Moment).

---

## 🔐 Data Handling

* Persist all 5 days of data in a single Zustand store mapped to MMKV.
* Ensure original user inputs for "DropBox" are never stored; only the reframed versions.

---

## 🧭 Senior Engineer Mindset

1. **Be Immersive**: If the UI feels like a standard app, it's wrong. It should feel like a ritual.
2. **Be Performant**: Use MMKV for snap-fast state reads. Optimize animations to 60fps.
3. **Be Specific**: If an interaction is described in the PRD (like the 48-hour Streak Shield), implement it with high fidelity.

