import React, { useState } from 'react';
import Randomizer from './components/Randomizer';
import ListAll from './components/ListAll';
import GroupRandom from './components/GroupRandom';
import SpinningWheel from './components/SpinningWheel';
import CountdownTimer from './components/CountdownTimer';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reusable Sidebar Wrapper to keep state inside components but UI consistent
  const SidebarWrapper = ({ children }) => (
    <>
      <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>

      <div className={`sidebar-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      
      <aside className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/app-icon.svg" alt="Destiny Logo" style={{ width: '24px', height: '24px' }} />
            <h1 className="app-title">Destiny</h1>
          </div>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>

        <div className="tabs-minimal">
          <button className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`} onClick={() => {setActiveTab('single'); setIsMenuOpen(false);}}>
            Single
          </button>
          <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => {setActiveTab('list'); setIsMenuOpen(false);}}>
            List All
          </button>
          <button className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`} onClick={() => {setActiveTab('group'); setIsMenuOpen(false);}}>
            Group
          </button>
          <button className={`tab-btn ${activeTab === 'wheel' ? 'active' : ''}`} onClick={() => {setActiveTab('wheel'); setIsMenuOpen(false);}}>
            Wheel
          </button>
          <button className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => {setActiveTab('timer'); setIsMenuOpen(false);}}>
            Timer
          </button>
        </div>

        <div className="controls-section">
          {children}
        </div>
      </aside>
    </>
  );

  return (
    <div className="dashboard-layout">
      {activeTab === 'single' && <Randomizer SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'list' && <ListAll SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'group' && <GroupRandom SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'wheel' && <SpinningWheel SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'timer' && <CountdownTimer SidebarWrapper={SidebarWrapper} />}
    </div>
  );
}
