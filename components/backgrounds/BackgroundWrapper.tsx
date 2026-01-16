'use client';

import { BackgroundType, ColorPalette, COLOR_PALETTES } from '@/lib/theme';
import Clouds from './Clouds';
import Waves from './Waves';
import Particles from './Particles';
import Aurora from './Aurora';

interface BackgroundWrapperProps {
  type: BackgroundType;
  colorPalette: ColorPalette;
}

export default function BackgroundWrapper({ type, colorPalette }: BackgroundWrapperProps) {
  const palette = COLOR_PALETTES[colorPalette];

  const renderBackground = () => {
    switch (type) {
      case 'clouds':
        return <Clouds />;
      case 'waves':
        return <Waves />;
      case 'particles':
        return <Particles />;
      case 'aurora':
        return <Aurora />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: palette.gradient }}
      />

      {/* Animated background overlay */}
      {renderBackground()}
    </div>
  );
}
