import React, { useState, useRef, useEffect } from 'react';

export default function Stopwatch({ SidebarWrapper }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  
  const startTimeRef = useRef(0);
  const requestRef = useRef();

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const updateTime = () => {
    setElapsed(Date.now() - startTimeRef.current);
    requestRef.current = requestAnimationFrame(updateTime);
  };

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsed;
      requestRef.current = requestAnimationFrame(updateTime);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      cancelAnimationFrame(requestRef.current);
      setIsRunning(false);
    }
  };

  const handleLap = () => {
    if (isRunning && laps.length < 5) {
      setLaps([...laps, elapsed]);
    }
  };

  const handleReset = () => {
    cancelAnimationFrame(requestRef.current);
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <SidebarWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={handleReset} disabled={elapsed === 0}>
            RESET TIMER
          </button>
        </div>
      </SidebarWrapper>

      <main className="stage">
        <div className="stage-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative' }}>
            <div 
              className="mega-number" 
              style={{ 
                fontSize: 'clamp(5rem, 15vw, 12rem)', 
                whiteSpace: 'nowrap', 
                fontVariantNumeric: 'tabular-nums', 
                cursor: 'pointer', 
                transition: 'all 0.3s',
                textShadow: isRunning ? '0 0 30px rgba(212, 175, 55, 0.6)' : 'none'
              }}
              onClick={() => isRunning ? handlePause() : handleStart()}
              title={isRunning ? "Click to Pause" : "Click to Start"}
            >
              {formatTime(elapsed)}
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleLap(); }}
              disabled={!isRunning || laps.length >= 5}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: (isRunning && laps.length < 5) ? 'pointer' : 'not-allowed',
                opacity: (isRunning && laps.length < 5) ? 0.5 : 0.1,
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => { if(isRunning && laps.length < 5) e.target.style.opacity = '1'; }}
              onMouseLeave={(e) => { if(isRunning && laps.length < 5) e.target.style.opacity = '0.5'; }}
            >
              LAP
            </button>
          </div>
          
          {/* Laps Display */}
          {laps.length > 0 && (
            <div style={{ marginTop: '3rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ color: 'var(--gold-primary)', textAlign: 'center', marginBottom: '1rem', letterSpacing: '2px' }}>RANKING</h3>
              {laps.map((lapTime, idx) => (
                <div key={idx} className="reveal-flash" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1rem 2rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--gold-primary)',
                  fontSize: '2rem',
                  fontWeight: '600',
                  color: '#fff',
                  animationDelay: '0s'
                }}>
                  <span style={{ color: 'var(--gold-light)' }}>#{idx + 1}</span>
                  <span style={{ fontFamily: 'monospace' }}>{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
