/**
 * Server-side AI Deep Dive analysis endpoint using Claude 3.5 Sonnet
 * Processes collection data and analytics to generate investment insights
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import type { Collection, AIAnalytics } from '@/lib/collections-data';
import type { MarketAnalytics, HolderAnalytics, ActivityAnalytics } from '@/lib/analytics-service';

/**
 * Server-side AI analysis endpoint for investment thesis generation
 * Receives collection and analytics data, returns Claude 3.5 Sonnet analysis
 */
export async function POST(request: NextRequest) {
  try {
    const { collection, marketHealth, holderAnalysis, activityTrends } = await request.json();

    // Validate inputs
    if (!collection || !collection.contractAddress) {
      return NextResponse.json(
        { error: 'Invalid request: collection data required' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    console.log(`🧠 API: Starting Claude AI analysis for ${collection.name}...`);

    // Prepare comprehensive analysis context
    const hasMarketData = !!marketHealth;
    const hasHolderData = !!holderAnalysis;
    const hasActivityData = !!activityTrends;
    
    // Build sophisticated Claude prompt
    const prompt = `You are an expert NFT investment analyst specializing in Shape Network collections. Provide a comprehensive investment analysis for this collection.

COLLECTION DATA:
Name: ${collection.name || 'Unnamed Collection'}
Symbol: ${collection.symbol || 'N/A'}
Supply: ${collection.totalSupply || 'Unknown'}
Current Holders: ${collection.owners || 'Unknown'}
Contract: ${collection.contractAddress}

ON-CHAIN ANALYTICS:
${hasMarketData ? `📈 MARKET HEALTH:
• Momentum: ${marketHealth.momentum} trend
• Recent Activity: ${marketHealth.transferCount24h} transfers in 24h
• Active Traders: ${marketHealth.uniqueTraders24h} unique addresses
• Liquidity Score: ${marketHealth.liquidityScore}/100
• Avg Transaction: ${marketHealth.avgTransactionValue} ETH` : '📈 Market data unavailable'}

${hasHolderData ? `👥 HOLDER ANALYSIS:
• Distribution: ${holderAnalysis.distribution} ownership pattern
• Concentration Risk: ${holderAnalysis.concentrationRatio}% held by top holders
• Total Holders: ${holderAnalysis.totalHolders}
• Whale Count: ${holderAnalysis.whaleHolders} major holders (>5% supply)
• Cross-Collection Holders: ${holderAnalysis.crossCollectionHolders} diversified collectors` : '👥 Holder data unavailable'}

${hasActivityData ? `⚡ ACTIVITY TRENDS:
• Trading Pattern: ${activityTrends.tradingPattern}
• Transfer Velocity: ${activityTrends.transferVelocity} daily transfers
• Gas Efficiency: ${activityTrends.gasEfficiency} (Shape Network optimized)
• Peak Activity: ${activityTrends.peakActivity}
• Trend Direction: ${activityTrends.trendDirection}` : '⚡ Activity data unavailable'}

ANALYSIS REQUIREMENTS:
Provide a professional investment analysis as JSON with this exact structure:

{
  "investmentThesis": "buy" | "hold" | "avoid",
  "confidenceScore": 85,
  "culturalSignificance": "Detailed cultural and artistic significance assessment",
  "riskFactors": ["Primary risk factor", "Secondary risk factor", "Additional concern"],
  "opportunities": ["Key opportunity 1", "Growth potential 2", "Strategic advantage 3"],
  "comparableCollections": ["Similar Project 1", "Comparable Collection 2"],
  "collectorProfile": "Detailed target collector profile and investment style",
  "reasoning": "Comprehensive investment thesis with specific data points and market context"
}

ANALYSIS GUIDELINES:
• confidenceScore: 0-100 integer based on data quality and conviction
• Consider Shape Network's unique positioning in the L2 ecosystem
• Evaluate both quantitative metrics and qualitative cultural factors
• Assess risk/reward balance for different investor types
• Factor in broader NFT market trends and Shape Network adoption
• Be specific and data-driven in your reasoning
• Each array should contain exactly 2-3 meaningful items

Focus on providing actionable investment insights that combine technical analysis with cultural understanding of the Shape Network ecosystem.`;

    // Generate Claude analysis
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      maxTokens: 1000,
    });

    // Parse and validate Claude's response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Structure and validate the response
    const aiAnalysis: AIAnalytics = {
      investmentThesis: analysis.investmentThesis || 'hold',
      confidenceScore: Math.max(0, Math.min(100, parseInt(analysis.confidenceScore) || 50)),
      culturalSignificance: analysis.culturalSignificance || `${collection.name} represents unique digital culture on Shape Network.`,
      riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors.slice(0, 3) : ['General market volatility', 'Shape Network adoption risk'],
      opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities.slice(0, 3) : ['Early ecosystem participation', 'Potential for growth'],
      comparableCollections: Array.isArray(analysis.comparableCollections) ? analysis.comparableCollections.slice(0, 2) : ['Similar Shape Network Collections', 'Emerging NFT Projects'],
      collectorProfile: analysis.collectorProfile || 'Collectors interested in Shape Network digital assets',
      reasoning: analysis.reasoning || `${collection.name} shows potential as a Shape Network collection.`
    };

    console.log(`✅ API: Claude AI analysis complete for ${collection.name} - ${aiAnalysis.confidenceScore}% confidence`);

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis
    });

  } catch (error) {
    console.error('❌ API: Claude AI analysis failed:', error);
    
    return NextResponse.json(
      { 
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}