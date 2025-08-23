// PersonaSelector component - Choose your NFT personality
// Will be enhanced with full persona selection UI

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type PersonaType, PERSONA_DEFINITIONS } from '@/lib/collections-data';

interface PersonaSelectorProps {
  onPersonaSelect: (persona: PersonaType) => void;
  analyzing: boolean;
}

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
            className="w-full"
            style={{ backgroundColor: persona.color }}
          >
            {analyzing ? 'Analyzing...' : 'Select'}
          </Button>
        </Card>
      ))}
    </div>
  );
}