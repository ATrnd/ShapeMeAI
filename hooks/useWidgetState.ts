/**
 * Complete application state management (loading, personas, results, analytics)
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

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

  /**
   * Background cache initialization - fetches 16 Shape Network collections
   * Progressive loading with real-time status updates
   */
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

  /**
   * Widget expansion - transitions to persona selection
   */
  const expandWidget = () => {
    setState(prev => ({
      ...prev,
      widgetExpanded: true
    }));
  };

  /**
   * Widget collapse - resets to ready state
   */
  const collapseWidget = () => {
    setState(prev => ({
      ...prev,
      widgetExpanded: false,
      selectedPersona: null,
      results: null,
      analyzing: false
    }));
  };

  /**
   * AI persona analysis - calls Claude 3.5 Sonnet for collection curation
   * On-demand processing with fallback to simple selection
   */
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
      results: null,
      error: null
    }));

    try {
      console.log(`🤖 Starting AI analysis for ${persona.toUpperCase()} persona...`);
      
      // Call our AI analysis API
      const response = await fetch('/api/analyze-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona,
          collections: state.cachedCollections
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis API failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'AI analysis failed');
      }

      console.log(`✅ AI analysis complete: ${data.analysis.selectedCollections.length} collections selected`);
      console.log(`🧠 AI reasoning: ${data.analysis.reasoning}`);
      
      setState(prev => ({
        ...prev,
        analyzing: false,
        results: data.analysis.selectedCollections
      }));

    } catch (error) {
      console.error('❌ AI persona analysis failed:', error);
      
      // Fallback to simple selection if AI fails
      try {
        console.log('🔄 Using fallback collection selection...');
        const fallbackResults = await getCollectionsByPersona(persona);
        
        setState(prev => ({
          ...prev,
          analyzing: false,
          results: fallbackResults,
          error: `AI analysis failed, using fallback selection. ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      } catch (fallbackError) {
        setState(prev => ({
          ...prev,
          analyzing: false,
          error: 'Both AI analysis and fallback failed, please try again'
        }));
      }
    }
  };

  /** Auto-initialize cache on component mount */
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
