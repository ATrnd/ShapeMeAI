# ShapeMeAI - AI-Powered NFT Discovery Engine

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Claude](https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-orange?logo=anthropic)
![Shape Network](https://img.shields.io/badge/Network-Shape%20Mainnet-7C3AED)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Hackathon](https://img.shields.io/badge/ShapeCraft-2-purple)

![ShapeMeAI_banner](https://github.com/ATrnd/ShapeMeAI/raw/main/img/01_ShapeMeAI_banner.jpg)

- **Hackathon Project**: Built for [ShapeCraft 2](https://shape.network/shapecraft).
- **Developer**: [ATrnd](https://github.com/ATrnd)
- **Tech Stack**: Next.js 15, TypeScript, Claude 3.5 Sonnet, Alchemy SDK, Tailwind CSS

## Project Overview
**ShapeMeAI** is an AI-powered NFT discovery engine that matches collectors with Shape Network collections based on cultural personas and aesthetic preferences.

### How It Works
Find your perfect NFT collections through AI persona matching and cultural analysis.

### Live Demo
- **Deployed URL**: [ShapeMeAI](https://shape-me-40yst1bun-atrnds-projects.vercel.app/?_vercel_share=7m6TBORMZ6HlD1aVI9ydHzAmsjQYWqzd)
- **Screen Recording**: [Vision / Demo Walkthrough](https://github.com/ATrnd/ShapeMeAI/raw/main/demo/ShapeMeAI.mp4)

---

## Concept & Vision

**ShapeMeAI** is designed as a three-layer ecosystem that transforms how users discover, interact with, and leverage blockchain-based assets.

### Three-Layer Architecture

#### **Layer 1: Service Layer** *(Current Implementation)*
The foundation that **solves the navigation problem**. 

**The Challenge**: NFT discovery is overwhelming for newcomers. Without personalized guidance, users either avoid the space entirely or make random choices that don't reflect their true preferences and personality.

**The Solution**: A cross-platform plugin that provides persona-based curation:

Designed for [stack.shape](https://stack.shape.network/) & NFT marketplaces - a system that categorizes users by taste and aesthetic preference, with personas sorting collections based on cultural significance and artistic themes.

**Core Philosophy**: Reduce cognitive load, abstract AI complexity, and provide Web2-familiar experiences with Web3 capabilities.

---

#### **Layer 2: Social Layer** *(Concept - Future Development)*
Building on the service foundation (Layer 1) to **enable experience sharing**.

Users can package their curated selections into shareable NFTs—essentially "recommendation playlists" that carry rich metadata about preferences and discoveries. These NFTs become vehicles for:

- **Social Discovery**: Share curated collections like sharing playlists
- **Cross-User Learning**: AI learns from successful recommendation patterns
- **Gamified Curation**: Reward systems for quality recommendations
- **Network Effects**: The more users share, the smarter the system becomes

---

#### **Layer 3: Agent Layer** *(Concept - Future Development)*
The final layer that creates a **self-reinforcing data ecosystem**.

Sophisticated AI agents trained on user-generated data from Layer 2 (Social Layer), creating specialized capabilities for different contexts. These agents feed back into Layer 1 (Service Layer), continuously improving the core service.

**The Result**: A complete **Data-Driven Growth Loop** where:

- **AI-powered persona matching** solves essential NFT discovery problems
- **Users engage** with personalized recommendations, generating valuable preference data
- **NFTs become data carriers** between users, creating behavioral networks
- **AI agents learn** from collective behavior to enhance recommendations
- **Enhanced experiences** drive more engagement and attract new users
- **Network effects accelerate** as data quality improves the entire ecosystem

![Three-Layer Architecture](https://github.com/ATrnd/ShapeMeAI/raw/main/img/02_ShapeMeAI_concept.jpg)

---

# User Walkthrough

### Quick Start Guide (2-3 minutes)

#### **Step 1: Initial Experience**
1. **Visit the application** - You'll see the ShapeMeAI widget in loading state
2. **Watch the progress** - Real-time status updates as we fetch 16 NFT collections from Shape Network Mainnet
3. **Wait for "Ready"** - Loading completes with ✨ "Ready to discover your persona!" message

![Step 1: Initial Experience](https://github.com/ATrnd/ShapeMeAI/raw/main/img/03_ShapeMeAI_init.jpg)

#### **Step 2: Persona Discovery**
1. **Click "Discover My NFT Persona"** - Widget expands to show 4 persona options
2. **Choose your personality**:
   - 🔥 **RENEGADE** - Anti-establishment rebel (try this for edgy collections)
   - ⚡ **FOMO** - Trend-chasing maximalist (try this for hype projects)
   - 🧘 **ZEN** - Mindful digital collector nerd (try this for thoughtful curation)
   - 💫 **CHAOS** - Unpredictable maximalist (try this for experimental projects)
3. **AI analyzes** - Watch as Claude 3.5 Sonnet processes all collections for your persona

![Step 2: Persona Discovery](https://github.com/ATrnd/ShapeMeAI/raw/main/img/04_ShapeMeAI_personas.jpg)

#### **Step 3: Explore AI Recommendations**
1. **View curated results** - See 3-4 collections perfectly matched to your persona
2. **Browse collection cards** - Each shows key metrics and visuals
3. **Check collection details** - Supply, owners, and metadata from live blockchain data

![Step 3: Explore AI Recommendations](https://github.com/ATrnd/ShapeMeAI/raw/main/img/05_ShapeMeAI_rec.jpg)

#### **Step 4: Deep Dive Analytics**
1. **Click "Analyze" on any collection** - Opens progressive disclosure panel
2. **Try each analytics button** - Each fetches fresh blockchain data:
   - 📈 **Market Health** - Live momentum analysis (bullish/neutral/bearish)
   - 👥 **Holder Analysis** - Distribution patterns & whale detection
   - ⚡ **Activity Trends** - Trading velocity & pattern classification
   - 🧠 **AI Deep Dive** - Complete investment thesis with confidence scoring

![Step 4: Deep Dive Analytics](https://github.com/ATrnd/ShapeMeAI/raw/main/img/06_ShapeMeAI_nfo.jpg)

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ShapeMeAI System                     │
├─────────────────────────────────────────────────────────┤
│  Frontend (Next.js 15 + TypeScript)                     │
│  ├── 4-Step Widget Flow (WidgetShell.tsx)               │
│  ├── State Management (useWidgetState.ts)               │
│  └── UI Components (Tailwind + shadcn/ui)               │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                             │
│  ├── Shape Network Collections (16 contracts)           │
│  ├── Alchemy SDK Integration                            │
│  └── Collection Cache Management                        │
├─────────────────────────────────────────────────────────┤
│  Analytics Layer                                        │
│  ├── Market Health (data processing + simple logic)     │
│  ├── Holder Analysis (ownership data + calculations)    │
│  ├── Activity Trends (transfer data + pattern logic)    │
│  └── AI Deep Dive (Claude 3.5 Sonnet analysis)          │
├─────────────────────────────────────────────────────────┤
│  AI Integration                                         │
│  ├── Persona Matching (Claude 3.5 Sonnet)               │
│  ├── Investment Thesis Generation (Claude 3.5)          │
│  └── Cultural Analysis & Reasoning                      │
├─────────────────────────────────────────────────────────┤
│  External Dependencies                                  │
│  ├── Alchemy SDK (Shape Network blockchain data)        │
│  ├── Anthropic API (Claude 3.5 Sonnet)                  │
│  └── Vercel AI SDK (AI integration wrapper)             │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

```
📁 ShapeMeAI File Structure & Responsibilities
├── /components/widget/            
│   ├── WidgetShell.tsx               → Main container, orchestrates 4-step flow
│   ├── PersonaSelector.tsx           → 4 persona UI + selection handling
│   ├── CollectionResults.tsx         → Results display + analytics interface
│   └── ProgressBar.tsx               → Animated loading states + progress
├── /hooks/
│   └── useWidgetState.ts             → Complete application state management
├── /lib/
│   ├── collections-data.ts           → Types, persona definitions, cache mgmt
│   ├── shape-collections-fetcher.ts  → Alchemy SDK blockchain integration
│   ├── analytics-service.ts          → 4 analytics functions + AI analysis
│   └── ai-service.ts                 → Claude API integration + prompt eng
├── /app/api/
│   ├── analyze-persona/route.ts      → Server-side AI processing endpoint
│   └── ai-analysis/route.ts          → Server-side AI Deep Dive analysis
└── /app/
    ├── layout.tsx                    → Theme provider + wallet integration
    └── page.tsx                      → Main application entry point
```

---

## Data Flow Architecture

### 1. Initial Load Flow
```
User Visits → Background Cache Initiation
    ↓
shape-collections-fetcher.ts
    ↓
Alchemy SDK API Calls (16 Collections)
    ↓
Collection Metadata + Owner Counts
    ↓
useWidgetState.ts (Cache Storage)
    ↓
Widget Activation (Ready State)
```

### 2. Persona Analysis Flow
```
User Selects Persona → useWidgetState.ts
    ↓
API Call: /api/analyze-persona
    ↓
ai-service.ts: analyzePersonaCollections()
    ↓
Claude 3.5 Sonnet (Sophisticated Prompts)
    ↓
AI Curation (3-4 Collections Selected)
    ↓
CollectionResults.tsx (Display Results)
```

### 3. Analytics Flow (Per Collection)

```
User Clicks "Analyze" → CollectionResults.tsx
  ↓
Progressive Disclosure Panel Opens
  ↓
User Clicks Analytics Button → Triggers:
  ├── Market Health → fetchMarketHealth()
  ├── Holder Analysis → fetchHolderAnalysis()
  ├── Activity Trends → fetchActivityTrends()
  └── AI Deep Dive → fetchAIAnalysis()
  ↓
Each Function:
  ├── Market/Holder/Activity: Call Alchemy SDK (Fresh Data)
  ├── AI Deep Dive: Calls /api/ai-analysis (Claude 3.5 Sonnet)
  ├── Processes Blockchain Data + AI Analysis
  └── Returns Structured Results
  ↓
Real-time UI Updates (Color-coded Insights: Green/Red/Yellow)
```

---

## AI Integration Details

### 1. Persona Matching Engine
- **File**: `lib/ai-service.ts`
- **Function**: `analyzePersonaCollections()`
- **AI Model**: Claude 3.5 Sonnet
- **Purpose**: Matches 16 Shape Network collections to user personas
- **Sophistication**: Custom prompts per persona with cultural analysis criteria

### 2. Investment Thesis Generation
- **File**: `lib/analytics-service.ts`
- **Function**: `fetchAIAnalysis()`
- **AI Model**: Claude 3.5 Sonnet for deep analysis
- **Output**:
  - Investment thesis (buy/hold/avoid)
  - Confidence scoring (0-100%)
  - Risk factor identification
  - Opportunity analysis
  - Cultural significance assessment
  - Comparable collection matching

## Data Analytics Pipeline

### 1. Market Health Analysis
- **File**: `lib/analytics-service.ts`
- **Function**: `fetchMarketHealth()`
- **Logic**: Simple momentum classification based on transfer thresholds
- **Data Source**: Live Alchemy transfer data + calculated liquidity scoring

### 2. Holder Distribution Analysis
- **File**: `lib/analytics-service.ts`
- **Function**: `fetchHolderAnalysis()`
- **Logic**: Mathematical distribution analysis with threshold-based classification
- **Data Source**: Alchemy ownership data + calculated concentration ratios

### 3. Activity Trend Analysis
- **File**: `lib/analytics-service.ts`
- **Function**: `fetchActivityTrends()`
- **Logic**: Transfer velocity calculations with pattern classification
- **Data Source**: Alchemy transfer data + gas efficiency metrics

---

## Persona System

ShapeMeAI features 4 distinct user personas, each with tailored AI analysis:

### 🔥 **RENEGADE** - "Anti-establishment rebel"
- **Theme**: Anti-establishment, punk rebellion, questioning normalcy
- **AI Criteria**: Underground aesthetics, countercultural themes, experimental concepts
- **Target Collections**: Edgy, provocative, anti-mainstream projects

### ⚡ **FOMO** - "Trend-chasing maximalist"  
- **Theme**: Fear of missing out, trend-following, hype-driven
- **AI Criteria**: Viral potential, social momentum, trending aesthetics
- **Target Collections**: High-buzz, socially shareable projects

### 🧘 **ZEN** - "Mindful digital collector nerd"
- **Theme**: Mindfulness, balance, thoughtful curation
- **AI Criteria**: Minimalist aesthetics, philosophical depth, timeless appeal
- **Target Collections**: Contemplative, meaningful, well-crafted projects

### 💫 **CHAOS** - "Unpredictable maximalist"
- **Theme**: Randomness, experimentation, breaking patterns
- **AI Criteria**: Innovative concepts, multiple styles, creative chaos
- **Target Collections**: Boundary-pushing, experimental, wildly creative projects

---

## Technical Implementation

### Core Technologies
- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Custom React hooks
- **Theme System**: next-themes with full dark/light support
- **Blockchain Integration**: Alchemy SDK
- **AI Integration**: Anthropic Claude 3.5 Sonnet via Vercel AI SDK

### Key Features Implemented
- ✅ **4-Step Progressive Disclosure UI**
- ✅ **Real-time Shape Network blockchain data**
- ✅ **AI-powered persona matching and investment analysis**
- ✅ **Complete dark/light theme system**
- ✅ **Professional loading states & animations**
- ✅ **Comprehensive error handling & fallbacks**
- ✅ **Responsive layout design**
- ✅ **Type-safe API integration**

### Environment Configuration
```env
# Blockchain Data
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
ALCHEMY_API_KEY=your_alchemy_key

# AI Integration  
ANTHROPIC_API_KEY=your_anthropic_key

# Wallet Integration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

---

## Shape Network Integration

### Curated Collection Set
ShapeMeAI analyzes **16 real Shape Network NFT collections**:

```typescript
// Real Shape Network Collection Contracts
export const SHAPE_COLLECTION_CONTRACTS = [
  "0x6E148B55e4Cd30Ea6727d7E0661c3918A6C4E9Db", // Almost Normal
  "0xdad1276ecd6d27116da400b33c81ce49d91d5831", // Shape Punks  
  "0x5fa1fdb5fe2c315abaad750dae700747f250b0c2", // DEFAULT_STATE.EXE
  "0xab3a867a6b14cc2f3286b9f03698656f8a892e9e", // COPE SALADA
  "0xf2e4b2a15872a20d0ffb336a89b94ba782ce9ba5", // DeePle
  // ... + 11 more collections
];
```

### Live Data Integration
- **Collection Metadata**: Name, symbol, total supply via Alchemy SDK
- **Ownership Data**: Holder counts, concentration ratios, distribution classification
- **Activity Data**: Transfer history, calculated trading velocity, pattern analysis
- **Market Data**: Momentum classification, calculated liquidity scoring based on transfer frequency

---

## Getting Started

### Prerequisites
- Yarn or npm
- Alchemy API key
- Anthropic API key
- WalletConnect Project ID

### Installation
```bash
# Clone repository
git clone https://github.com/ATrnd/ShapeMeAI.git
cd ShapeMeAI

# Install dependencies
yarn install

# Configure environment
cp .env.example .env.local
# Add your API keys

# Run development server
yarn dev
```

### Development Commands
```bash
yarn dev        # Start development server
yarn build      # Build for production
yarn start      # Start production server
yarn lint       # Run ESLint
yarn type-check # TypeScript validation
```

## Special Thanks To

- **@bonafidehan** - Founder of Shape, for pushing @Shape_L2 forward
- **@williamhzo** - For building exceptional libraries and community support that streamlined development
- **Shape Community** - All Shapers contributing to the ShapeCraft 2 hackathon and building the ecosystem
- **Sponsors** - @opensea, @Alchemy, @manifoldxyz, @TransientLabs, @0xDecaArt, @Collab_Currency
- **Judges** - For their time and expertise in evaluating ShapeCraft 2 submissions

*Now we're Shaping Culture Together*

![Glider](https://github.com/ATrnd/ShapeMeAI/raw/main/img/glider-0.1.png)
