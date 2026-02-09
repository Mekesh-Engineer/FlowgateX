import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/common/Logo';
import '@/styles/components/LoadingScreen.css';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface LoadingScreenProps {
  /** Callback when loading completes */
  onComplete?: () => void;
  /** Minimum duration in ms (default: 3000) */
  minDuration?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LoadingScreen({
  onComplete,
  minDuration = 3000,
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure the loading screen stays visible for at least minDuration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  const handleExitComplete = () => {
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo */}
            <Logo size="lg" showText={false} className="mb-2" />
            
            {/* FLOWGATEX Text with Brand Colors */}
            <div className="flowgatex-text">
              {'FLOWGATEX'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4 + index * 0.1,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 1
                  }}
                  className="flowgatex-letter"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Loading Dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="loading-dot"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}