// Core data types and interfaces for Shape Network NFT collections
// ShapeMeAI - AI-powered NFT discovery and analysis

export interface Collection {
  contractAddress: string;
  name: string | null;
  symbol: string | null;
  totalSupply: number | null;
  owners: number | null;
  image: string;
  openSeaUrl: string;
  originalUrl: string;
}

export interface CollectionCache {
  collections: Collection[];
  lastUpdated: string;
  networkStatus: 'healthy' | 'degraded' | 'offline';
  totalCollections: number;
}

export type PersonaType = 'renegade' | 'fomo' | 'zen' | 'chaos';

export interface PersonaDefinition {
  id: PersonaType;
  emoji: string;
  title: string;
  description: string;
  color: string;
  theme: string;
}

// Pre-defined personas for AI-powered NFT matching
export const PERSONA_DEFINITIONS: Record<PersonaType, PersonaDefinition> = {
  renegade: {
    id: 'renegade',
    emoji: '🔥',
    title: 'RENEGADE',
    description: 'Anti-establishment rebel',
    color: '#ef4444',
    theme: 'Anti-establishment, punk rebellion, questioning normalcy'
  },
  fomo: {
    id: 'fomo',
    emoji: '⚡',
    title: 'FOMO',
    description: 'Trend-chasing maximalist',
    color: '#eab308',
    theme: 'Fear of missing out, trend-following, hype-driven'
  },
  zen: {
    id: 'zen',
    emoji: '🧘',
    title: 'ZEN',
    description: 'Mindful collector',
    color: '#22c55e',
    theme: 'Mindfulness, balance, thoughtful curation'
  },
  chaos: {
    id: 'chaos',
    emoji: '💫',
    title: 'CHAOS',
    description: 'Unpredictable maximalist',
    color: '#8b5cf6',
    theme: 'Randomness, experimentation, breaking patterns'
  }
};

// Real collections cache - populated from Shape Network
let CACHED_COLLECTIONS: Collection[] = [];

// Load collections data from Shape Network via Alchemy SDK
export async function loadCollectionsCache(
  onProgress?: (progress: number, status: string) => void
): Promise<Collection[]> {
  // Return cached data if already loaded
  if (CACHED_COLLECTIONS.length > 0) {
    console.log(`✅ Using cached collections (${CACHED_COLLECTIONS.length} items)`);
    return CACHED_COLLECTIONS;
  }

  try {
    // Dynamic import to avoid SSR issues
    const { fetchAllShapeCollections, testShapeNetworkConnection } = await import('./shape-collections-fetcher');
    
    // Test connection first
    onProgress?.(5, 'Testing Shape Network connection...');
    const isConnected = await testShapeNetworkConnection();
    
    if (!isConnected) {
      throw new Error('Shape Network connection failed');
    }

    // Fetch real collections
    onProgress?.(10, 'Fetching Shape Network collections...');
    const collections = await fetchAllShapeCollections((progress, status) => {
      // Map fetcher progress (0-100) to overall progress (10-95)
      const overallProgress = 10 + (progress * 0.85);
      onProgress?.(overallProgress, status);
    });

    // Cache the results
    CACHED_COLLECTIONS = collections;
    onProgress?.(100, `Loaded ${collections.length} collections!`);
    
    return collections;

  } catch (error) {
    console.error('❌ Failed to load real collections, using fallback data:', error);
    
    // Fallback to sample data if real fetch fails
    onProgress?.(90, 'Using fallback collections...');
    const fallbackCollections = await loadFallbackCollections();
    CACHED_COLLECTIONS = fallbackCollections;
    
    onProgress?.(100, 'Fallback collections loaded');
    return fallbackCollections;
  }
}

// Fallback collections if real fetch fails
async function loadFallbackCollections(): Promise<Collection[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      contractAddress: '0x6E148B55e4Cd30Ea6727d7E0661c3918A6C4E9Db',
      name: 'Almost Normal',
      symbol: 'NORMAL',
      totalSupply: 2500,
      owners: 800,
      image: 'https://via.placeholder.com/300x300?text=Almost+Normal',
      openSeaUrl: 'https://opensea.io/collection/almost-normal',
      originalUrl: 'https://almostnormal.xyz'
    },
    {
      contractAddress: '0xdad1276ecd6d27116da400b33c81ce49d91d5831',
      name: 'Shape Punks',
      symbol: 'SPUNK',
      totalSupply: 1000,
      owners: 600,
      image: 'https://via.placeholder.com/300x300?text=Shape+Punks',
      openSeaUrl: 'https://opensea.io/collection/shape-punks',
      originalUrl: 'https://shapepunks.com'
    },
    {
      contractAddress: '0x5fa1fdb5fe2c315abaad750dae700747f250b0c2',
      name: 'DEFAULT_STATE.EXE',
      symbol: 'DSE',
      totalSupply: 500,
      owners: 300,
      image: 'https://via.placeholder.com/300x300?text=DEFAULT_STATE',
      openSeaUrl: 'https://opensea.io/collection/default-state-exe',
      originalUrl: 'https://defaultstate.xyz'
    }
  ];
}

// Get collections for a specific persona (will be enhanced with AI)
export async function getCollectionsByPersona(persona: PersonaType): Promise<Collection[]> {
  const collections = await loadCollectionsCache();
  
  // Simple mapping for now - will be replaced with AI analysis
  const personaMap: Record<PersonaType, number[]> = {
    renegade: [0], // First collection
    fomo: [1],     // Second collection  
    zen: [2],      // Third collection
    chaos: [0, 1]  // Multiple collections
  };
  
  const indices = personaMap[persona] || [0];
  return indices.map(i => collections[i]).filter(Boolean);
}

// Get all raw collections (for AI analysis)
export function getAllCollections(): Collection[] {
  return CACHED_COLLECTIONS;
}

// Clear cache (for development/testing)
export function clearCollectionsCache(): void {
  CACHED_COLLECTIONS = [];
}