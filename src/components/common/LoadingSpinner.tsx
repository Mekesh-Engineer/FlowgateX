import { motion } from 'framer-motion';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface LoadingSpinnerProps {
  /** Whether to display full screen */
  fullScreen?: boolean;
  /** Loading message to display */
  message?: string;
  /** Size of the spinner in pixels */
  size?: number;
}

// =============================================================================
// LOADING SPINNER COMPONENT
// =============================================================================

function LoadingSpinner({ 
  fullScreen = false, 
  message = 'Loading...', 
  size = 48 
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="absolute inset-0 rounded-full border-2 border-[#00A3DB]/20"
          style={{ width: size, height: size }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00A3DB]"
          style={{ width: size, height: size }}
        />
      </motion.div>
      {message && (
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-primary)]">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
}

export default LoadingSpinner;
