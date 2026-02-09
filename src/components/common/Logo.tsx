import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface LogoProps {
  /** Size variant of the logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the text alongside the icon */
  showText?: boolean;
  /** Whether to wrap the logo in a Link to home */
  linkToHome?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Use MUI styling (for sidebar/MUI contexts) */
  useMui?: boolean;
  /** Custom aria-label */
  ariaLabel?: string;
}

// =============================================================================
// SIZE CONFIGURATIONS
// =============================================================================

const SIZE_CONFIG = {
  xs: {
    containerSize: 'w-8 h-8',
    iconSize: 'text-[18px]',
    textSize: 'text-base',
    muiContainerSize: 32,
    muiIconSize: '18px',
    muiTextVariant: 'subtitle1' as const,
    gap: 'gap-2',
  },
  sm: {
    containerSize: 'w-10 h-10',
    iconSize: 'text-[20px]',
    textSize: 'text-lg',
    muiContainerSize: 40,
    muiIconSize: '20px',
    muiTextVariant: 'h6' as const,
    gap: 'gap-2',
  },
  md: {
    containerSize: 'w-12 h-12',
    iconSize: 'text-[24px]',
    textSize: 'text-xl',
    muiContainerSize: 48,
    muiIconSize: '24px',
    muiTextVariant: 'h6' as const,
    gap: 'gap-3',
  },
  lg: {
    containerSize: 'w-14 h-14',
    iconSize: 'text-[28px]',
    textSize: 'text-2xl',
    muiContainerSize: 56,
    muiIconSize: '28px',
    muiTextVariant: 'h5' as const,
    gap: 'gap-3',
  },
  xl: {
    containerSize: 'w-16 h-16',
    iconSize: 'text-[32px]',
    textSize: 'text-3xl',
    muiContainerSize: 64,
    muiIconSize: '32px',
    muiTextVariant: 'h4' as const,
    gap: 'gap-4',
  },
};

// =============================================================================
// LOGO ICON COMPONENT (Tailwind Version)
// =============================================================================

interface LogoIconProps {
  size: keyof typeof SIZE_CONFIG;
  animated?: boolean;
}

const LogoIcon: React.FC<LogoIconProps> = ({ size, animated = true }) => {
  const config = SIZE_CONFIG[size];

  const content = (
    <div className="relative">
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-[#00A3DB] to-[#A3D639] rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        style={{ filter: 'blur(8px)' }}
      />
      <div className={`relative ${config.containerSize} rounded-xl bg-gradient-to-br from-[#00A3DB] via-[#0091c4] to-[#A3D639] flex items-center justify-center shadow-lg shadow-[#00A3DB]/25 group-hover:shadow-[#00A3DB]/40 transition-all duration-300 group-hover:scale-105`}>
        <span 
          className={`material-symbols-outlined ${config.iconSize} text-white font-semibold`}
          style={{ 
            fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
          }}
        >
          stream
        </span>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// =============================================================================
// LOGO TEXT COMPONENT (Tailwind Version)
// =============================================================================

interface LogoTextProps {
  size: keyof typeof SIZE_CONFIG;
}

const LogoText: React.FC<LogoTextProps> = ({ size }) => {
  const config = SIZE_CONFIG[size];

  return (
    <span className={`${config.textSize} font-bold bg-gradient-to-r from-[#00A3DB] to-[#A3D639] bg-clip-text text-transparent`}>
      FlowGateX
    </span>
  );
};

// =============================================================================
// MUI LOGO COMPONENT
// =============================================================================

interface MuiLogoProps {
  size: keyof typeof SIZE_CONFIG;
  showText: boolean;
}

const MuiLogo: React.FC<MuiLogoProps> = ({ size, showText }) => {
  const config = SIZE_CONFIG[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: size === 'xs' ? 1.5 : 2 }}>
      <Box
        sx={{
          width: config.muiContainerSize,
          height: config.muiContainerSize,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #00A3DB 0%, #0091c4 50%, #A3D639 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(0, 163, 219, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 163, 219, 0.4)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: config.muiIconSize,
            color: 'white',
            fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
          }}
        >
          stream
        </span>
      </Box>
      {showText && (
        <Typography
          variant={config.muiTextVariant}
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #00A3DB 0%, #A3D639 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FlowGateX
        </Typography>
      )}
    </Box>
  );
};

// =============================================================================
// MAIN LOGO COMPONENT
// =============================================================================

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  linkToHome = true,
  className = '',
  useMui = false,
  ariaLabel = 'FlowGateX Home',
}) => {
  const config = SIZE_CONFIG[size];

  // MUI Version
  if (useMui) {
    const content = <MuiLogo size={size} showText={showText} />;

    if (linkToHome) {
      return (
        <Link to="/" aria-label={ariaLabel} className={className}>
          {content}
        </Link>
      );
    }

    return <div className={className}>{content}</div>;
  }

  // Tailwind Version
  const content = (
    <div className={`flex items-center ${config.gap} group`}>
      <LogoIcon size={size} />
      {showText && <LogoText size={size} />}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className={`inline-flex ${className}`} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return <div className={`inline-flex ${className}`}>{content}</div>;
};

// =============================================================================
// LOGO ICON ONLY EXPORT (For favicon-style usage)
// =============================================================================

export const LogoIconOnly: React.FC<{ size?: keyof typeof SIZE_CONFIG; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={`${config.containerSize} rounded-xl bg-gradient-to-br from-[#00A3DB] via-[#0091c4] to-[#A3D639] flex items-center justify-center shadow-lg shadow-[#00A3DB]/25 ${className}`}
    >
      <span
        className={`material-symbols-outlined ${config.iconSize} text-white font-semibold`}
        style={{
          fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
        }}
      >
        stream
      </span>
    </div>
  );
};

export default Logo;
