/**
 * Results display + analytics interface
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, TrendingUp, Users, Activity, Brain, ExternalLink, Loader2 } from 'lucide-react';
import { type Collection, type PersonaType, PERSONA_DEFINITIONS } from '@/lib/collections-data';
import { 
  fetchMarketHealth, 
  fetchHolderAnalysis, 
  fetchActivityTrends, 
  fetchAIAnalysis,
  type MarketAnalytics,
  type HolderAnalytics,
  type ActivityAnalytics,
  type AIAnalytics
} from '@/lib/analytics-service';

interface CollectionResultsProps {
  persona: PersonaType;
  collections: Collection[];
  onBack: () => void;
}

interface AnalyticsState {
  [contractAddress: string]: {
    expanded: boolean;
    loading: {
      market: boolean;
      holder: boolean;
      activity: boolean;
      ai: boolean;
    };
    data: {
      market?: MarketAnalytics;
      holder?: HolderAnalytics;
      activity?: ActivityAnalytics;
      ai?: AIAnalytics;
    };
  };
}

/**
 * Displays AI-curated collections with progressive disclosure analytics
 * Each collection has 4 analytics types: Market, Holder, Activity, AI Deep Dive
 */
export function CollectionResults({ persona, collections, onBack }: CollectionResultsProps) {
  const personaInfo = PERSONA_DEFINITIONS[persona];
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({});

  /**
   * Toggles analytics panel expansion for a specific collection
   * Initializes analytics state if not present
   */
  const toggleAnalytics = (contractAddress: string) => {
    setAnalyticsState(prev => ({
      ...prev,
      [contractAddress]: {
        ...prev[contractAddress],
        expanded: !prev[contractAddress]?.expanded || false,
        loading: prev[contractAddress]?.loading || {
          market: false,
          holder: false,
          activity: false,
          ai: false
        },
        data: prev[contractAddress]?.data || {}
      }
    }));
  };

  /**
   * Fetches analytics data for specific type (market/holder/activity/ai)
   * Sets loading state, calls appropriate service function, updates UI
   */
  const fetchAnalytics = async (
    collection: Collection, 
    type: 'market' | 'holder' | 'activity' | 'ai'
  ) => {
    const contractAddress = collection.contractAddress;
    
    // Set loading state
    setAnalyticsState(prev => ({
      ...prev,
      [contractAddress]: {
        ...prev[contractAddress],
        loading: {
          ...prev[contractAddress]?.loading,
          [type]: true
        }
      }
    }));

    try {
      let result;
      
      switch (type) {
        case 'market':
          result = await fetchMarketHealth(collection);
          break;
        case 'holder':
          result = await fetchHolderAnalysis(collection);
          break;
        case 'activity':
          result = await fetchActivityTrends(collection);
          break;
        case 'ai':
          const currentState = analyticsState[contractAddress];
          result = await fetchAIAnalysis(
            collection,
            currentState?.data?.market,
            currentState?.data?.holder,
            currentState?.data?.activity
          );
          break;
      }

      // Update data
      setAnalyticsState(prev => ({
        ...prev,
        [contractAddress]: {
          ...prev[contractAddress],
          loading: {
            ...prev[contractAddress]?.loading,
            [type]: false
          },
          data: {
            ...prev[contractAddress]?.data,
            [type]: result
          }
        }
      }));

    } catch (error) {
      console.error(`Analytics fetch failed for ${type}:`, error);
      
      // Clear loading state
      setAnalyticsState(prev => ({
        ...prev,
        [contractAddress]: {
          ...prev[contractAddress],
          loading: {
            ...prev[contractAddress]?.loading,
            [type]: false
          }
        }
      }));
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {collections.map((collection) => {
            const state = analyticsState[collection.contractAddress];
            const isExpanded = state?.expanded || false;
            
            return (
              <Card key={collection.contractAddress} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Collection Header */}
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{personaInfo.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {collection.name || 'Unknown Collection'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {collection.totalSupply ? `${collection.totalSupply.toLocaleString()} supply` : 'Supply unknown'} • 
                        {collection.owners ? ` ${collection.owners.toLocaleString()} owners` : ' Owners unknown'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(collection.openSeaUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          OpenSea
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleAnalytics(collection.contractAddress)}
                        >
                          <Search className="w-3 h-3 mr-1" />
                          {isExpanded ? 'Hide' : 'Analyze'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Panel */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Deep Analytics
                      </h4>
                      
                      {/* Analytics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Market Health */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAnalytics(collection, 'market')}
                          disabled={state?.loading?.market}
                          className="h-auto p-3 flex-col items-start"
                        >
                          {state?.loading?.market ? (
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                          ) : (
                            <TrendingUp className="w-4 h-4 mb-1" />
                          )}
                          <span className="text-xs font-medium">Market Health</span>
                        </Button>

                        {/* Holder Analysis */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAnalytics(collection, 'holder')}
                          disabled={state?.loading?.holder}
                          className="h-auto p-3 flex-col items-start"
                        >
                          {state?.loading?.holder ? (
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                          ) : (
                            <Users className="w-4 h-4 mb-1" />
                          )}
                          <span className="text-xs font-medium">Holder Analysis</span>
                        </Button>

                        {/* Activity Trends */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAnalytics(collection, 'activity')}
                          disabled={state?.loading?.activity}
                          className="h-auto p-3 flex-col items-start"
                        >
                          {state?.loading?.activity ? (
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                          ) : (
                            <Activity className="w-4 h-4 mb-1" />
                          )}
                          <span className="text-xs font-medium">Activity Trends</span>
                        </Button>

                        {/* AI Deep Dive */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAnalytics(collection, 'ai')}
                          disabled={state?.loading?.ai}
                          className="h-auto p-3 flex-col items-start"
                        >
                          {state?.loading?.ai ? (
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                          ) : (
                            <Brain className="w-4 h-4 mb-1" />
                          )}
                          <span className="text-xs font-medium">AI Deep Dive</span>
                        </Button>
                      </div>

                      {/* Analytics Results */}
                      {state?.data && (
                        <div className="space-y-4">
                          {/* Market Health Results */}
                          {state.data.market && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                              <div className="flex items-center mb-2">
                                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                                <h5 className="font-medium text-sm">Market Health</h5>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">24h Transfers</p>
                                  <p className="font-medium">{state.data.market.transferCount24h}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Unique Traders</p>
                                  <p className="font-medium">{state.data.market.uniqueTraders24h}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Liquidity Score</p>
                                  <p className="font-medium">{state.data.market.liquidityScore}/100</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Momentum</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    state.data.market.momentum === 'bullish' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : state.data.market.momentum === 'bearish'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {state.data.market.momentum}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Holder Analysis Results */}
                          {state.data.holder && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                              <div className="flex items-center mb-2">
                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                <h5 className="font-medium text-sm">Holder Analysis</h5>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Total Holders</p>
                                  <p className="font-medium">{state.data.holder.totalHolders}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Concentration</p>
                                  <p className="font-medium">{state.data.holder.concentrationRatio}%</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Whale Holders</p>
                                  <p className="font-medium">{state.data.holder.whaleHolders}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Distribution</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    state.data.holder.distribution === 'distributed' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : state.data.holder.distribution === 'concentrated'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {state.data.holder.distribution}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Activity Trends Results */}
                          {state.data.activity && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                              <div className="flex items-center mb-2">
                                <Activity className="w-4 h-4 mr-2 text-purple-600" />
                                <h5 className="font-medium text-sm">Activity Trends</h5>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Transfer Velocity</p>
                                  <p className="font-medium">{state.data.activity.transferVelocity}/day</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Trading Pattern</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    state.data.activity.tradingPattern === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : state.data.activity.tradingPattern === 'dormant'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {state.data.activity.tradingPattern}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Peak Activity</p>
                                  <p className="font-medium text-xs">{state.data.activity.peakActivity}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Trend Direction</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    state.data.activity.trendDirection === 'up' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : state.data.activity.trendDirection === 'down'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {state.data.activity.trendDirection}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* AI Analysis Results */}
                          {state.data.ai && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                              <div className="flex items-center mb-3">
                                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                                <h5 className="font-medium text-sm">AI Deep Dive</h5>
                                <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {state.data.ai.confidenceScore}% confidence
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Investment Thesis</p>
                                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                                    state.data.ai.investmentThesis === 'buy' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : state.data.ai.investmentThesis === 'avoid'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {state.data.ai.investmentThesis.toUpperCase()}
                                  </span>
                                </div>

                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cultural Significance</p>
                                  <p className="text-sm">{state.data.ai.culturalSignificance}</p>
                                </div>

                                {state.data.ai.riskFactors.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Risk Factors</p>
                                    <ul className="text-sm space-y-1">
                                      {state.data.ai.riskFactors.map((risk, idx) => (
                                        <li key={idx} className="text-red-600 dark:text-red-400">• {risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {state.data.ai.opportunities.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Opportunities</p>
                                    <ul className="text-sm space-y-1">
                                      {state.data.ai.opportunities.map((opp, idx) => (
                                        <li key={idx} className="text-green-600 dark:text-green-400">• {opp}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">AI Reasoning</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{state.data.ai.reasoning}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}