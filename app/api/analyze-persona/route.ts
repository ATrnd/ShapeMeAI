/**
 * Server-side AI processing endpoint
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzePersonaCollections } from '@/lib/ai-service';
import { PERSONA_DEFINITIONS, type PersonaType, type Collection } from '@/lib/collections-data';

/**
 * Server-side AI processing endpoint for persona analysis
 * Validates inputs and delegates to Claude 3.5 Sonnet analysis service
 */
export async function POST(request: NextRequest) {
  try {
    const { persona, collections } = await request.json();

    // Validate inputs
    if (!persona || !Array.isArray(collections)) {
      return NextResponse.json(
        { error: 'Invalid request: persona and collections array required' },
        { status: 400 }
      );
    }

    if (!PERSONA_DEFINITIONS[persona as PersonaType]) {
      return NextResponse.json(
        { error: `Unknown persona: ${persona}` },
        { status: 400 }
      );
    }

    // Get persona definition
    const personaDefinition = PERSONA_DEFINITIONS[persona as PersonaType];

    console.log(`🤖 API: Starting AI analysis for ${persona.toUpperCase()} persona...`);

    // Perform AI analysis server-side
    const analysis = await analyzePersonaCollections(
      persona as PersonaType,
      personaDefinition,
      collections as Collection[]
    );

    console.log(`✅ API: AI analysis complete - ${analysis.selectedCollections.length} collections selected`);

    return NextResponse.json({
      success: true,
      analysis: {
        selectedCollections: analysis.selectedCollections,
        reasoning: analysis.reasoning,
        confidence: analysis.confidence
      }
    });

  } catch (error) {
    console.error('❌ API: AI analysis failed:', error);
    
    return NextResponse.json(
      { 
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}