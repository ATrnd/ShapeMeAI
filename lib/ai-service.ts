/**
 * Claude API integration with sophisticated persona prompts
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { type Collection, type PersonaType, type PersonaDefinition } from './collections-data';

/** AI Analysis Result Interface */
export interface PersonaAnalysisResult {
  selectedCollections: Collection[];
  reasoning: string;
  confidence: number; // 0-1 scale
}

/**
 * Health check for Claude API integration
 * Validates API key and connection status
 */
export async function testClaudeConnection(): Promise<boolean> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ No Anthropic API key found');
      return false;
    }

    console.log('🤖 Testing Claude API connection...');
    
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: 'Respond with exactly "OK" if you can read this.',
      maxTokens: 10,
    });

    const isConnected = text.trim().toLowerCase().includes('ok');
    console.log(`${isConnected ? '✅' : '❌'} Claude API connection ${isConnected ? 'successful' : 'failed'}`);
    
    return isConnected;
  } catch (error) {
    console.error('❌ Claude API connection failed:', error);
    return false;
  }
}

/**
 * Core AI analysis function - matches collections to persona using Claude 3.5 Sonnet
 * Uses sophisticated cultural analysis prompts tailored per persona
 */
export async function analyzePersonaCollections(
  persona: PersonaType,
  personaDefinition: PersonaDefinition,
  allCollections: Collection[]
): Promise<PersonaAnalysisResult> {
  try {
    console.log(`🤖 Analyzing ${allCollections.length} collections for ${persona.toUpperCase()} persona...`);

    // Create sophisticated persona-specific prompt
    const prompt = createPersonaPrompt(persona, personaDefinition, allCollections);

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
    });

    // Parse Claude's response
    const analysis = parseClaudeResponse(text, allCollections);
    
    console.log(`✅ AI analysis complete: ${analysis.selectedCollections.length} collections selected with ${Math.round(analysis.confidence * 100)}% confidence`);
    
    return analysis;

  } catch (error) {
    console.error(`❌ AI analysis failed for ${persona}:`, error);
    
    // Fallback to simple selection if AI fails
    return {
      selectedCollections: allCollections.slice(0, 2),
      reasoning: `AI analysis failed, showing first 2 collections as fallback. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      confidence: 0.1
    };
  }
}

/**
 * Creates sophisticated persona-specific prompts for Claude analysis
 * Tailors cultural analysis criteria based on persona type
 */
function createPersonaPrompt(persona: PersonaType, personaDefinition: PersonaDefinition, collections: Collection[]): string {
  const basePrompt = `You are an expert NFT cultural analyst specializing in blockchain subcultures and digital art movements on Shape Network.

MISSION: Analyze ${collections.length} real NFT collections and select 3-4 that authentically embody the "${personaDefinition.title}" persona.

TARGET PERSONA: ${personaDefinition.title} ${personaDefinition.emoji}
CORE IDENTITY: ${personaDefinition.description}
CULTURAL THEME: ${personaDefinition.theme}

COLLECTIONS DATABASE:
${collections.map((c, i) => `${i + 1}. "${c.name || 'Unnamed'}" (${c.symbol || 'N/A'})
   Supply: ${c.totalSupply || 'Unknown'} | Owners: ${c.owners || 'Unknown'}
   Contract: ${c.contractAddress}`).join('\n\n')}

PERSONA-SPECIFIC ANALYSIS CRITERIA:`;

  // Add persona-specific criteria
  const personaPrompts = {
    renegade: `${basePrompt}
For RENEGADE ${personaDefinition.emoji}, prioritize collections that:
- Challenge conventional NFT aesthetics or market norms
- Have underground, countercultural, or punk vibes  
- Represent artistic rebellion or anti-establishment themes
- Appeal to collectors who reject mainstream trends
- Show experimental, edgy, or provocative concepts
- Have smaller, tight-knit communities of rebels

Look for: Dark aesthetics, punk art, glitch art, underground movements, anti-corporate themes`,

    fomo: `${basePrompt}
For FOMO ${personaDefinition.emoji}, prioritize collections that:
- Generate excitement, hype, or urgency
- Have viral potential or trending aesthetics
- Appeal to collectors who chase the "next big thing"
- Show high activity, buzz, or social momentum
- Feature eye-catching, shareable visual styles
- Represent current or emerging cultural trends

Look for: Trending styles, viral concepts, hype-worthy art, social media friendly, momentum indicators`,

    zen: `${basePrompt}
For ZEN ${personaDefinition.emoji}, prioritize collections that:
- Promote calm, mindfulness, or spiritual reflection
- Have minimalist, meditative, or nature-inspired aesthetics
- Appeal to thoughtful, intentional collectors
- Show artistic depth, philosophy, or meaning
- Encourage slow appreciation over quick flipping
- Represent balance, harmony, or inner peace

Look for: Minimalist art, nature themes, spiritual concepts, meditative qualities, timeless appeal`,

    chaos: `${basePrompt}
For CHAOS ${personaDefinition.emoji}, prioritize collections that:
- Embrace randomness, unpredictability, or complexity
- Have maximalist, eclectic, or wildly creative aesthetics
- Appeal to experimental, risk-taking collectors
- Show innovative, boundary-pushing concepts
- Feature multiple styles, themes, or approaches
- Represent creative freedom and artistic chaos

Look for: Experimental art, random generation, complex systems, innovative concepts, creative chaos`
  };

  const fullPrompt = personaPrompts[persona] + `

RESPONSE FORMAT: Provide your analysis as JSON with this exact structure:
{
  "selectedCollections": [1, 3, 7],
  "reasoning": "I selected these collections because...",
  "confidence": 0.85
}

IMPORTANT:
- selectedCollections: Array of collection numbers (1-${collections.length}) that best match this persona
- reasoning: 2-3 sentences explaining your cultural analysis and why these collections embody the ${personaDefinition.title} persona
- confidence: Your confidence score (0-1) in this persona match

Select 3-4 collections that most authentically represent the ${personaDefinition.title} mindset and aesthetic preferences.`;

  return fullPrompt;
}

/**
 * Parses Claude's JSON response into structured analysis result
 * Handles response validation and fallback error handling
 */
function parseClaudeResponse(response: string, allCollections: Collection[]): PersonaAnalysisResult {
  try {
    // Extract JSON from response (handle any markdown formatting)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!parsed.selectedCollections || !Array.isArray(parsed.selectedCollections)) {
      throw new Error('Invalid selectedCollections format');
    }

    // Convert collection indices to actual Collection objects
    const selectedCollections = parsed.selectedCollections
      .map((index: number) => {
        const collectionIndex = index - 1; // Convert 1-based to 0-based
        return allCollections[collectionIndex];
      })
      .filter(Boolean) // Remove any undefined collections
      .slice(0, 4); // Limit to 4 collections max

    return {
      selectedCollections,
      reasoning: parsed.reasoning || 'AI analysis completed',
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)) // Clamp between 0-1
    };

  } catch (error) {
    console.error('❌ Failed to parse Claude response:', error);
    console.log('Raw response:', response);
    
    // Fallback parsing
    return {
      selectedCollections: allCollections.slice(0, 2),
      reasoning: 'AI response parsing failed, using fallback selection',
      confidence: 0.2
    };
  }
}
