import React, { useState, useEffect } from 'react';
import Randomizer from './components/Randomizer';
import ListAll from './components/ListAll';
import GroupRandom from './components/GroupRandom';
import SpinningWheel from './components/SpinningWheel';
import CountdownTimer from './components/CountdownTimer';
import Stopwatch from './components/Stopwatch';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Global State for Classes
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('destiny_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse classes", e);
      }
    }
    // Migration: If no classes exist, convert old savedNames to a default class
    const oldNames = localStorage.getItem('savedNames') || '';
    return [{ id: 1, name: 'Default Class', namesText: oldNames }];
  });

  const [activeClassId, setActiveClassId] = useState(() => {
    const saved = localStorage.getItem('destiny_active_class_id');
    if (saved) return Number(saved);
    return 1;
  });

  // Save to localStorage whenever classes or activeClassId changes
  useEffect(() => {
    localStorage.setItem('destiny_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('destiny_active_class_id', activeClassId.toString());
  }, [activeClassId]);

  // Derived state for the currently active class
  const activeClassIndex = classes.findIndex(c => c.id === activeClassId);
  // Fallback to first class if ID not found (e.g., after deleting)
  const safeIndex = activeClassIndex >= 0 ? activeClassIndex : 0;
  const currentClass = classes[safeIndex] || { id: 1, name: 'Default Class', namesText: '' };
  
  // Safe update function to pass down to components
  const handleUpdateActiveNames = (newText) => {
    setClasses(prev => prev.map(c => 
      c.id === currentClass.id ? { ...c, namesText: newText } : c
    ));
  };

  // Reusable Sidebar Wrapper
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

  return (
    <div className="dashboard-layout">
      {activeTab === 'single' && <Randomizer SidebarWrapper={SidebarWrapper} namesText={currentClass.namesText} setNamesText={handleUpdateActiveNames} />}
      {activeTab === 'list' && <ListAll SidebarWrapper={SidebarWrapper} namesText={currentClass.namesText} setNamesText={handleUpdateActiveNames} />}
      {activeTab === 'group' && <GroupRandom SidebarWrapper={SidebarWrapper} namesText={currentClass.namesText} setNamesText={handleUpdateActiveNames} />}
      {activeTab === 'wheel' && <SpinningWheel SidebarWrapper={SidebarWrapper} namesText={currentClass.namesText} setNamesText={handleUpdateActiveNames} />}
      {activeTab === 'timer' && <CountdownTimer SidebarWrapper={SidebarWrapper} />}
      {activeTab === 'stopwatch' && <Stopwatch SidebarWrapper={SidebarWrapper} />}

      {/* Manage Classes Modal */}
      {isManageModalOpen && (
        <div className="modal-overlay show" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px', border: '1px solid var(--panel-border)' }}>
            <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>Manage Classes</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '50vh', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {classes.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={c.name}
                    placeholder="Class Name"
                    onChange={(e) => {
                      setClasses(prev => prev.map(cls => cls.id === c.id ? { ...cls, name: e.target.value } : cls));
                    }}
                    style={{ flex: 1, padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontFamily: 'inherit' }}
                  />
                  <button 
                    onClick={() => {
                      if (classes.length === 1) return alert("Cannot delete the last class. Please add a new one first.");
                      if (confirm(`Are you sure you want to delete "${c.name}"? This cannot be undone.`)) {
                        setClasses(prev => prev.filter(cls => cls.id !== c.id));
                        if (currentClass.id === c.id) {
                           setActiveClassId(classes.find(cls => cls.id !== c.id).id);
                        }
                      }
                    }}
                    style={{ background: 'rgba(255, 68, 68, 0.2)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.4)', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    title="Delete Class"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button 
                onClick={() => {
                  const newId = Date.now();
                  setClasses(prev => [...prev, { id: newId, name: `New Class ${prev.length + 1}`, namesText: '' }]);
                  setActiveClassId(newId);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '0.8rem' }}
              >
                + ADD CLASS
              </button>
              <button 
                onClick={() => setIsManageModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.8rem' }}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
