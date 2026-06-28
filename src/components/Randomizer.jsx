import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Randomizer({ SidebarWrapper }) {
  const [inputType, setInputType] = useState('numbers');
  const [namesText, setNamesText] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [isUnique, setIsUnique] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('?');
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const intervalRef = useRef(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00bfff', '#4b0082', '#9400d3', '#ff1493'];

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        startVelocity: 80,
        origin: { x: 0, y: 1 },
        colors: rainbowColors
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        startVelocity: 80,
        origin: { x: 1, y: 1 },
        colors: rainbowColors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const getItems = () => {
    if (inputType === 'names') {
      return namesText.split('\n').map(n => n.trim()).filter(n => n);
    }
    const arr = [];
    for (let i = min; i <= max; i++) arr.push(i);
    return arr;
  };

  const handleRandomize = () => {
    const items = getItems();
    
    if (items.length === 0) {
      alert("Please provide some names.");
      return;
    }
    if (inputType === 'numbers' && min > max) {
      alert("From number must be less than or equal to To number.");
      return;
    }

    let availableItems = items;

    if (isUnique) {
      availableItems = items.filter(n => !usedNumbers.includes(n));
      if (availableItems.length === 0) {
        alert("All items have been drawn! Resetting history.");
        setUsedNumbers([]);
        availableItems = items;
      }
    }

    setIsSpinning(true);
    setIsFinal(false);

    const spinDuration = 5000;
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const randomDisplay = availableItems[Math.floor(Math.random() * availableItems.length)];
      setCurrentNumber(randomDisplay);

      if (Date.now() - startTime >= spinDuration) {
        clearInterval(intervalRef.current);
        const finalItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        setCurrentNumber(finalItem);
        setIsSpinning(false);
        setIsFinal(true);
        if (isUnique) {
          setUsedNumbers(prev => [...prev, finalItem]);
        }
        fireConfetti();
      }
    }, 50);
  };

  const getDynamicFontSize = (text) => {
    if (inputType === 'numbers') return '12rem';
    const len = String(text).length;
    if (len <= 4) return '8rem';
    if (len <= 8) return '6rem';
    if (len <= 12) return '4.5rem';
    if (len <= 20) return '3rem';
    return '2.2rem';
  };

  const resetHistory = () => {
    setUsedNumbers([]);
    setCurrentNumber('?');
    setIsFinal(false);
  };

  return (
    <>
      <SidebarWrapper>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
          <button 
            style={{ flex: 1, background: inputType === 'numbers' ? 'rgba(212, 175, 55, 0.2)' : 'transparent', border: 'none', color: inputType === 'numbers' ? 'var(--gold-light)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setInputType('numbers')}
          >
            Numbers
          </button>
          <button 
            style={{ flex: 1, background: inputType === 'names' ? 'rgba(212, 175, 55, 0.2)' : 'transparent', border: 'none', color: inputType === 'names' ? 'var(--gold-light)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setInputType('names')}
          >
            Names
          </button>
        </div>

        {inputType === 'numbers' ? (
          <>
            <div className="input-group">
              <label>From Number</label>
              <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
            </div>
            <div className="input-group">
              <label>To Number</label>
              <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
            </div>
          </>
        ) : (
          <div className="input-group">
            <label>List of Names (One per line)</label>
            <textarea 
              value={namesText} 
              onChange={e => setNamesText(e.target.value)}
              placeholder="John&#10;Mary&#10;Peter..."
              style={{ width: '100%', height: '120px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--gold-light)', padding: '0.5rem 0.8rem', borderRadius: '8px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            />
          </div>
        )}

        <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <input type="checkbox" id="unique" checked={isUnique} onChange={e => setIsUnique(e.target.checked)} style={{ width: 'auto' }} />
          <label htmlFor="unique" style={{ margin: 0 }}>Unique Pick (No repeats)</label>
        </div>

        {isUnique && usedNumbers.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>History ({usedNumbers.length})</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
              {usedNumbers.map((n, i) => <span key={i} className="history-chip">{n}</span>)}
            </div>
            <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={resetHistory}>Reset History</button>
          </div>
        )}
      </SidebarWrapper>
      
      <main className="stage">
        <div className="stage-center">
          <div 
            className={`mega-number-container ${isSpinning ? 'disabled' : ''}`} 
            onClick={!isSpinning ? handleRandomize : undefined}
            title="Click to Randomize!"
          >
            <div className={`mega-number ${isSpinning ? 'spinning' : ''} ${isFinal ? 'final' : ''}`} style={{ fontSize: getDynamicFontSize(currentNumber), wordBreak: 'break-word', overflowWrap: 'break-word', padding: '0 2rem', textAlign: 'center', lineHeight: '1.2' }}>
              {currentNumber}
            </div>
          </div>
          {!isSpinning && !isFinal && currentNumber === '?' && (
            <div className="cool-hint">RANDOMIZE!</div>
          )}
        </div>
      </main>
    </>
  );
}
