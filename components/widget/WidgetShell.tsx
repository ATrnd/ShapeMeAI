// ShapeMeAI Widget Shell - Main container for AI-powered NFT discovery
// Implements 4-step progressive disclosure: Loading → Ready → Expanded → Results

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { PersonaSelector } from './PersonaSelector';
import { CollectionResults } from './CollectionResults';
import { useWidgetState } from '@/hooks/useWidgetState';
import { cn } from '@/lib/utils';

interface WidgetShellProps {
  className?: string;
}

export function WidgetShell({ className }: WidgetShellProps) {
  const {
    isLoading,
    progress,
    status,
    isDataReady,
    widgetActive,
    widgetExpanded,
    selectedPersona,
    analyzing,
    results,
    error,
    expandWidget,
    collapseWidget,
    selectPersona,
    retryCache
  } = useWidgetState();

  // Step 1: Loading state
  if (isLoading || !isDataReady) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", className)}>
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">ShapeMeAI</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered NFT discovery for your personality
            </p>
          </div>
          
          <ProgressBar progress={progress} status={status} />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={retryCache}
              >
                Retry
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Step 2: Ready state (collapsed widget)
  if (widgetActive && !widgetExpanded) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", className)}>
        <Card className="w-full max-w-md p-8 text-center hover:shadow-lg transition-all duration-300">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">ShapeMeAI</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover NFTs that match your personality
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              ✨ Ready to discover your persona!
            </p>
          </div>
          
          <Button 
            onClick={expandWidget}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Discover My NFT Persona
          </Button>
        </Card>
      </div>
    );
  }

  // Step 3: Expanded state (persona selection)
  if (widgetExpanded && !selectedPersona) {
    return (
      <div className={cn("min-h-screen p-4", className)}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={collapseWidget}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <h1 className="text-2xl font-bold">Choose Your NFT Persona</h1>
              </div>
            </div>
          </div>

          {/* Persona Selector */}
          <PersonaSelector 
            onPersonaSelect={selectPersona}
            analyzing={analyzing}
          />
        </div>
      </div>
    );
  }

  // Step 4: Results state
  if (selectedPersona && results) {
    return (
      <div className={cn("min-h-screen", className)}>
        <CollectionResults
          persona={selectedPersona}
          collections={results}
          onBack={() => selectPersona(null)}
        />
      </div>
    );
  }

  // Loading state for persona analysis
  if (selectedPersona && analyzing) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", className)}>
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">Analyzing Your Persona...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI is curating NFT collections that match your personality
            </p>
          </div>
          
          <div className="animate-pulse">
            <div className="h-2 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-full"></div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}