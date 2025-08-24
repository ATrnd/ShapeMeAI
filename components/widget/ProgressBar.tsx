/**
 * Animated loading states with bouncing dots
 * 
 * Part of ShapeMeAI - AI-Powered NFT Discovery Engine
 * ShapeCraft2 Hackathon Submission | Shape Network 2025
 * 
 * @author ATrnd
 */

'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  status: string;
  className?: string;
}

/**
 * Loading component with shimmer effects and bouncing dots
 * Real-time progress updates during blockchain data fetch
 */
export function ProgressBar({ progress, status, className }: ProgressBarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Status text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {status}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-2 bg-gray-100 dark:bg-gray-800"
        />
        
        {/* Animated shimmer effect */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 dark:via-gray-400/30 to-transparent animate-pulse rounded-full"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.5s ease-in-out' 
          }}
        />
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Loading dots animation */}
      <div className="flex justify-center items-center space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}