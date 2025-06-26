import React from 'react';
import './KioskLayout.css';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="kiosk-layout">
      <header className="kiosk-header">🛎️ Epale Taqueria</header>
      <main className="kiosk-main">{children}</main>
    </div>
  );
};

export default KioskLayout;
