"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Typed from 'typed.js';
import axios from 'axios';
import Preloader from './ui/preloader';
import { TypewriterEffect } from './ui/typewriter-effect';

const CREATIVITY_VALUES = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

const StoryInterface = () => {
    const [prompt, setPrompt] = useState('');
    const [showMagic, setShowMagic] = useState(false);
    const [showSlider, setShowSlider] = useState(false);
    const [creativity, setCreativity] = useState(0.5);
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPromptAtBottom, setIsPromptAtBottom] = useState(false);
  
  const storyRef = useRef(null);
  const typedRef = useRef<Typed | null>(null);


  const titleWords = [
    { text: "Crafting", className: "text-gray-100" },
    { text: "Tales,", className: "text-gray-100" },
    { text: "One", className: "text-gray-400" },
    { text: "Ink", className: "text-gray-400" },
    { text: "at", className: "text-gray-400" },
    { text: "a", className: "text-gray-400" },
    { text: "Time", className: "text-gray-400" },
  ];

  useEffect(() => {
    setShowMagic(prompt.length > 0);
  }, [prompt]);

  useEffect(() => {
    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    };
  }, []);

  const startTypeAnimation = (text: string) => {
    if (storyRef.current) {
      if (typedRef.current) {
        typedRef.current.destroy();
      }

      typedRef.current = new Typed(storyRef.current, {
        strings: [text],
        typeSpeed: 1,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
      });
    }
  };

  const handleSliderChange = (value: number) => {
    const closest = CREATIVITY_VALUES.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
    setCreativity(closest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setIsPromptAtBottom(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
        prompt: prompt.trim(),
        max_length: 256,
        temperature: creativity
      });

      const storyText = response.data.story || response.data;
      setStory(storyText);
      
      setTimeout(() => {
        startTypeAnimation(storyText);
      }, 100);

    } catch (error) {
      console.error('API Error:', error);
      setStory('Sorry, there was an error generating your story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#171717] text-white relative">
        {/* Title with TypewriterEffect */}
        <div className="w-full max-w-3xl mx-auto relative">
        <AnimatePresence>
          {!isPromptAtBottom && (
            <motion.div
            initial={{ opacity: 1, y: -120 }}
            animate={{ opacity: 1, y: -100 }}
            exit={{ opacity: 0, y: -120 }}
            className="absolute top-[-120px] left-0 right-0 text-center"
          >
            <TypewriterEffect 
              words={titleWords} 
              className="!text-6xl"
              cursorClassName="!h-12"
            />
          </motion.div>
          )}
        </AnimatePresence>
      {/* Story Display Area */}
      <div className="w-full max-w-3xl px-4 relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full bg-[#202020] rounded-lg p-6 h-[400px] overflow-y-auto mb-8"
            >
              <div className="flex items-center justify-center h-full">
                <Preloader />
              </div>
            </motion.div>
          )}
          
          {story && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-[#202020] rounded-lg p-6 h-[400px] overflow-y-auto mb-8"
            >
              <div className="story-container">
                <span ref={storyRef} className="whitespace-pre-wrap" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt Input Area */}
      <motion.div
  className="w-full max-w-2xl px-4 mx-auto"
  initial={{ y: !isPromptAtBottom ? '-50%' : '100%' }}
  animate={{ 
    y: isPromptAtBottom ? '3rem' : '-50%'
  }}
  transition={{ type: "spring", stiffness: 100 }}
>
        <form onSubmit={handleSubmit} className="relative">
          {showSlider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -60 }}
              className="absolute w-full bg-[#202020] p-4 rounded-lg mb-2 z-10"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm">Creativity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={creativity}
                  onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                  className="w-full accent-white"
                />
                <span className="text-sm">{creativity.toFixed(1)}</span>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center bg-[#202020] rounded-lg">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="eg : Once there was a knight lost in a forest"
              className="flex-1 bg-transparent p-4 outline-none placeholder:text-gray-400"
            />
            
            {showMagic && (
              <button
                type="button"
                onClick={() => setShowSlider(!showSlider)}
                className="p-4 text-gray-400 hover:text-white transition-colors"
              >
                <Wand2 className="w-5 h-5" />
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="p-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
    </div>
  );
};

export default StoryInterface;