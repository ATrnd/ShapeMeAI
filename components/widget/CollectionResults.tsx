// CollectionResults component - Display AI-curated NFT collections
// Will be enhanced with full analytics and collection cards

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { type Collection, type PersonaType, PERSONA_DEFINITIONS } from '@/lib/collections-data';

interface CollectionResultsProps {
  persona: PersonaType;
  collections: Collection[];
  onBack: () => void;
}

export function CollectionResults({ persona, collections, onBack }: CollectionResultsProps) {
  const personaInfo = PERSONA_DEFINITIONS[persona];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{personaInfo.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{personaInfo.title} Collections</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {collections.length} collections match your {personaInfo.description.toLowerCase()} personality
              </p>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.contractAddress} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">{personaInfo.emoji}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {collection.name || 'Unknown Collection'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {collection.totalSupply ? `${collection.totalSupply} supply` : 'Supply unknown'} • 
                {collection.owners ? ` ${collection.owners} owners` : ' Owners unknown'}
              </p>
              <Button variant="outline" className="w-full">
                View Collection
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}