import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './KioskLayout.css';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();

  return (
    <div className="kiosk-layout bg-bg-primary text-text-primary">
      <header className="kiosk-header bg-accent-primary text-white">🛎️ Epale Taqueria</header>
      <main className="kiosk-main bg-bg-primary">{children}</main>
    </div>
  );
};

export default KioskLayout;
