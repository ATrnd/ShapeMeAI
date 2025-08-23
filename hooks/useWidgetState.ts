// Widget state management hook for ShapeMeAI 4-step flow
// Manages: Loading → Ready → Expanded → Results

'use client';

import { useState, useEffect } from 'react';
import { loadCollectionsCache, getCollectionsByPersona, type Collection, type PersonaType } from '@/lib/collections-data';

interface WidgetState {
  // Step 1: Loading
  isLoading: boolean;
  progress: number;
  status: string;
  
  // Step 2: Ready  
  isDataReady: boolean;
  widgetActive: boolean;
  cachedCollections: Collection[];
  
  // Step 3: Expanded
  widgetExpanded: boolean;
  
  // Step 4: Analysis
  selectedPersona: PersonaType | null;
  analyzing: boolean;
  results: Collection[] | null;
  error: string | null;
}

const INITIAL_STATE: WidgetState = {
  isLoading: false,
  progress: 0,
  status: '',
  isDataReady: false,
  widgetActive: false,
  cachedCollections: [],
  widgetExpanded: false,
  selectedPersona: null,
  analyzing: false,
  results: null,
  error: null,
};

export function useWidgetState() {
  const [state, setState] = useState<WidgetState>(INITIAL_STATE);

  // Step 1: Background cache system
  const initiateBackgroundCache = async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      progress: 0,
      status: "Initializing ShapeMeAI...",
      widgetActive: false,
      error: null
    }));

    try {
      // Event 1: Initialize (0ms)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Event 2: Fetch collections (0-800ms)
      setState(prev => ({
        ...prev,
        progress: 25,
        status: "Loading Shape Network collections..."
      }));
      
      const collections = await loadCollectionsCache((progress, status) => {
        // Forward progress updates from the collection fetcher
        setState(prev => ({
          ...prev,
          progress: 25 + (progress * 0.5), // Map 0-100% to 25-75% 
          status
        }));
      });
      
      // Event 3: Process metadata (800-1200ms) 
      setState(prev => ({
        ...prev,
        progress: 80,
        status: "Processing collection metadata..."
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Event 4: Ready state (1200ms)
      setState(prev => ({
        ...prev,
        progress: 100,
        status: "✨ Ready to discover your persona!"
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Event 5: Activate widget (1700ms)
      setState(prev => ({
        ...prev,
        cachedCollections: collections,
        isDataReady: true,
        widgetActive: true,
        isLoading: false
      }));

    } catch (error) {
      console.error('Background cache failed:', error);
      
      // Fallback to offline mode
      setState(prev => ({
        ...prev,
        error: 'Failed to load collections, using demo data',
        cachedCollections: [],
        isDataReady: true,
        widgetActive: true,
        isLoading: false,
        progress: 100,
        status: "Ready (demo mode)"
      }));
    }
  };

  // Step 2: Widget activation (handled in Step 1)
  
  // Step 3: Widget expansion
  const expandWidget = () => {
    setState(prev => ({
      ...prev,
      widgetExpanded: true
    }));
  };

  const collapseWidget = () => {
    setState(prev => ({
      ...prev,
      widgetExpanded: false,
      selectedPersona: null,
      results: null,
      analyzing: false
    }));
  };

  // Step 4: Persona analysis
  const selectPersona = async (persona: PersonaType | null) => {
    if (!persona) {
      // Clear selection
      setState(prev => ({
        ...prev,
        selectedPersona: null,
        results: null,
        analyzing: false
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      selectedPersona: persona,
      analyzing: true,
      results: null
    }));

    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get persona-matched collections
      const results = await getCollectionsByPersona(persona);
      
      setState(prev => ({
        ...prev,
        analyzing: false,
        results
      }));

    } catch (error) {
      console.error('Persona analysis failed:', error);
      setState(prev => ({
        ...prev,
        analyzing: false,
        error: 'Analysis failed, please try again'
      }));
    }
  };

  // Auto-start cache on mount
  useEffect(() => {
    if (!state.isLoading && !state.isDataReady) {
      initiateBackgroundCache();
    }
  }, []);

  return {
    ...state,
    // Actions
    expandWidget,
    collapseWidget, 
    selectPersona,
    retryCache: initiateBackgroundCache
  };
}