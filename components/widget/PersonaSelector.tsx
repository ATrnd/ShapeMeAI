/**
 * 4 persona cards with selection logic
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type PersonaType, PERSONA_DEFINITIONS } from '@/lib/collections-data';

interface PersonaSelectorProps {
  onPersonaSelect: (persona: PersonaType) => void;
  analyzing: boolean;
}

/**
 * Renders 4 persona cards with theme-based styling
 * Triggers AI analysis on selection
 */
export function PersonaSelector({ onPersonaSelect, analyzing }: PersonaSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PERSONA_DEFINITIONS).map(([key, persona]) => (
        <Card key={key} className="p-6 text-center hover:shadow-lg transition-all duration-200">
          <div className="text-4xl mb-3">{persona.emoji}</div>
          <h3 className="text-lg font-bold mb-2">{persona.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {persona.description}
          </p>
          <Button
            onClick={() => onPersonaSelect(persona.id)}
            disabled={analyzing}
            className={`w-full text-white font-semibold ${
              persona.id === 'renegade' 
                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                : persona.id === 'fomo'
                ? 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700'
                : persona.id === 'zen'
                ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
            }`}
          >
            {analyzing ? 'Analyzing...' : 'Select'}
          </Button>
        </Card>
      ))}
    </div>
  );
}