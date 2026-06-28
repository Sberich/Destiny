import React, { useState } from 'react';
import Randomizer from './components/Randomizer';
import ListAll from './components/ListAll';
import GroupRandom from './components/GroupRandom';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('random');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const SidebarWrapper = ({ children }) => (
    <>
      {/* Floating Toggle Button */}
      <button className="menu-toggle-btn" onClick={toggleSidebar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Drawer */}
      <aside className={`sidebar-drawer ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/app-icon.svg" alt="Destiny Logo" style={{ width: '28px', height: '28px' }} />
            <h1 className="app-title">Destiny</h1>
          </div>
          <button className="close-btn" onClick={closeSidebar}>&times;</button>
        </div>
        
        <div className="tabs-vertical">
          <button 
            className={`tab-btn ${activeTab === 'random' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('random'); }}
          >
            Single / Unique
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('list'); }}
          >
            List All Number
          </button>
          <button 
            className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('group'); }}
          >
            Group Random
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
      {activeTab === 'random' && <Randomizer SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'list' && <ListAll SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'group' && <GroupRandom SidebarWrapper={SidebarWrapper} />}
    </div>
  );
}
