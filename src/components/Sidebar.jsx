import React from 'react';
import { useAppContext } from '../AppContext';

export default function Sidebar({ children }) {
  const {
    isMenuOpen, setIsMenuOpen,
    activeTab, setActiveTab,
    classes, currentClass, setActiveClassId, setIsManageModalOpen
  } = useAppContext();

  return (
    <>
      <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>

      <div className={`sidebar-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      
      <aside className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/app-icon.svg" alt="Destiny Logo" style={{ width: '24px', height: '24px' }} />
            <h1 className="app-title">Destiny</h1>
          </div>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">×</button>
        </div>

        <div className="class-selector" style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Active Class</label>
          <select 
            value={currentClass.id} 
            onChange={(e) => {
              if (e.target.value === 'manage') {
                setIsManageModalOpen(true);
                setIsMenuOpen(false);
              } else {
                setActiveClassId(Number(e.target.value));
              }
            }}
            style={{ 
              width: '100%', 
              padding: '0.6rem', 
              background: 'rgba(0,0,0,0.4)', 
              color: 'var(--gold-light)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="manage" style={{ color: 'var(--gold-primary)' }}>+ Manage Classes...</option>
          </select>
        </div>

        <div className="tabs-minimal" style={{ padding: '0 1rem' }}>
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
          <button className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`} onClick={() => {setActiveTab('stopwatch'); setIsMenuOpen(false);}}>
            Stopwatch
          </button>
        </div>

        <div className="controls-section">
          {children}
        </div>
      </aside>
    </>
  );
}
