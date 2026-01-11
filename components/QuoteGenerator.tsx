import React, { useState, useEffect } from 'react';
import { generateBirthdayQuote } from '../services/geminiService';
import { QuoteState } from '../types';
import { FALLBACK_QUOTES } from '../constants';

interface QuoteGeneratorProps {
  onQuoteGenerated: () => void;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ onQuoteGenerated }) => {
  const [quoteState, setQuoteState] = useState<QuoteState>({
    text: "Waiting for system initialization...",
    isLoading: false,
    error: null,
  });

  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Initial load
  useEffect(() => {
    handleGenerateClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateClick = async () => {
    setQuoteState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const text = await generateBirthdayQuote();
      setQuoteState({ text, isLoading: false, error: null });
      onQuoteGenerated();
    } catch (err) {
      // Fallback logic
      const nextQuote = FALLBACK_QUOTES[fallbackIndex];
      setFallbackIndex((prev) => (prev + 1) % FALLBACK_QUOTES.length);
      
      setQuoteState({
        text: nextQuote,
        isLoading: false,
        error: null // We swallow the error for UX, just showing fallback
      });
      onQuoteGenerated();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8 relative group">
      {/* Glow Effect Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Card Content */}
      <div className="relative p-8 bg-slate-900 ring-1 ring-gray-800/50 rounded-lg leading-none flex flex-col items-center text-center backdrop-blur-xl bg-opacity-80">
        
        <div className="mb-6 min-h-[80px] flex items-center justify-center">
            {quoteState.isLoading ? (
                <div className="flex space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                </div>
            ) : (
                <p className="text-xl md:text-2xl text-gray-100 font-light font-sans italic animate-[fadeIn_0.5s_ease-out]">
                  "{quoteState.text}"
                </p>
            )}
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={quoteState.isLoading}
          className={`
            relative px-8 py-3 rounded-full font-bold text-white transition-all duration-300
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center gap-2
          `}
        >
          {quoteState.isLoading ? (
            <span className="font-mono text-sm">WAIT A SEC...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="font-mono text-sm">GENERATE NEW QUOTE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuoteGenerator;