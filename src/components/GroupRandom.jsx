import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function GroupRandom({ SidebarWrapper }) {
  const [inputType, setInputType] = useState('numbers');
  const [namesText, setNamesText] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(40);
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [maxRevealedIndex, setMaxRevealedIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [spinText, setSpinText] = useState('SORTING');
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00bfff', '#4b0082', '#9400d3', '#ff1493'];

  const fireConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 8, angle: 60, spread: 55, startVelocity: 80, origin: { x: 0, y: 1 }, colors: rainbowColors });
      confetti({ particleCount: 8, angle: 120, spread: 55, startVelocity: 80, origin: { x: 1, y: 1 }, colors: rainbowColors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const fireSmallConfetti = () => {
    const duration = 1500; // 1.5 second burst for intermediate groups
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 60, startVelocity: 85, origin: { x: 0, y: 1 }, colors: rainbowColors });
      confetti({ particleCount: 6, angle: 120, spread: 60, startVelocity: 85, origin: { x: 1, y: 1 }, colors: rainbowColors });
      if (Date.now() < end) requestAnimationFrame(frame);
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

  const handleStartSort = () => {
    const items = getItems();
    
    if (items.length === 0) {
      alert("Please provide some names to group.");
      return;
    }
    if (inputType === 'numbers' && min > max) {
      alert("From number must be less than or equal to To number.");
      return;
    }
    if (groupSize < 1) {
      alert("Group size must be at least 1.");
      return;
    }

    setIsSpinning(true);
    setIsComplete(false);
    setCurrentGroupIndex(0);
    setMaxRevealedIndex(0);
    setGroups([]);

    // Calculate Groups in background
    let arr = [...items];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const totalStudents = arr.length;
    const numberOfGroups = Math.floor(totalStudents / groupSize) || 1;
    const generatedGroups = Array.from({ length: numberOfGroups }, () => []);
    
    let studentIndex = 0;
    for (let i = 0; i < numberOfGroups; i++) {
      for (let j = 0; j < groupSize; j++) {
        if (studentIndex < totalStudents) {
          generatedGroups[i].push(arr[studentIndex++]);
        }
      }
    }

    let groupIndex = 0;
    while (studentIndex < totalStudents) {
      generatedGroups[groupIndex].push(arr[studentIndex++]);
      groupIndex = (groupIndex + 1) % numberOfGroups;
    }

    runSpinAnimation(10000, () => {
      setGroups(generatedGroups);
      setIsComplete(true);
      setCurrentGroupIndex(0);
      setMaxRevealedIndex(0);
      fireSmallConfetti();
    });
  };

  const runSpinAnimation = (duration, onComplete) => {
    setIsSpinning(true);
    const startTime = Date.now();
    const texts = ['SORTING', 'SHUFFLING', 'ANALYZING', 'GROUPING', 'RANDOMIZING'];

    intervalRef.current = setInterval(() => {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setSpinText(randomText + '...');

      if (Date.now() - startTime >= duration) {
        clearInterval(intervalRef.current);
        setIsSpinning(false);
        if (onComplete) onComplete();
      }
    }, 150);
  };

  const handleNext = () => {
    if (currentGroupIndex < groups.length - 1) {
      if (currentGroupIndex === maxRevealedIndex) {
        // Unlocking a new group, run mini spin
        runSpinAnimation(3000, () => {
          const nextIdx = currentGroupIndex + 1;
          setMaxRevealedIndex(nextIdx);
          setCurrentGroupIndex(nextIdx);
          if (nextIdx === groups.length - 1) {
            fireConfetti();
          } else {
            fireSmallConfetti();
          }
        });
      } else {
        // Just navigating forward within already revealed groups
        setCurrentGroupIndex(currentGroupIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const handleReset = () => {
    setGroups([]);
    setIsComplete(false);
    setCurrentGroupIndex(0);
    setMaxRevealedIndex(0);
    setIsSpinning(false);
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

        <div className="input-group">
          <label>People per Group</label>
          <input type="number" value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} />
        </div>
        
        {isComplete && (
          <button className="btn-secondary" onClick={handleReset}>Reset Groups</button>
        )}
      </SidebarWrapper>

      <main className="stage">
        
        {/* Initial State */}
        {!isComplete && !isSpinning && (
          <div className="stage-center" style={{ cursor: 'pointer' }} onClick={handleStartSort} title="Click to start sorting">
            <div className="mega-number-container">
              <img src="/app-icon.svg" alt="Group Randomizer" style={{ width: '250px', height: '250px', objectFit: 'contain', animation: 'pulseOpacity 3s infinite' }} />
            </div>
            <div className="cool-hint">START GROUPING</div>
          </div>
        )}

        {/* Spinning State */}
        {isSpinning && (
          <div className="stage-center">
            <div className="mega-number-container disabled">
              <div className="mega-number spinning" style={{ fontSize: '4rem', letterSpacing: '5px' }}>
                {spinText}
              </div>
            </div>
          </div>
        )}

        {/* Revealed State (One group at a time) */}
        {isComplete && !isSpinning && groups.length > 0 && (
          <div className="presentation-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1000px', margin: '0 auto', gap: '2rem' }}>
            
            {/* Prev Button */}
            <button 
              className={`nav-arrow ${currentGroupIndex === 0 ? 'hidden' : ''}`} 
              onClick={handlePrev}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Current Group Card */}
            <div className="mega-group-card reveal-flash" style={{ flex: 1, minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} key={currentGroupIndex}>
              <div className="mega-group-header" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>
                Group {currentGroupIndex + 1}
              </div>
              <div className="mega-group-members" style={{ gap: '1.5rem' }}>
                {groups[currentGroupIndex].map((member, idx) => (
                  <span key={idx} className="mega-chip" style={{ padding: '1.5rem 2rem', fontSize: 'clamp(1.2rem, 3vw, 2.5rem)', wordBreak: 'break-word', maxWidth: '100%', whiteSpace: 'normal', textAlign: 'center', lineHeight: '1.3', animation: 'none', opacity: 1, transform: 'none' }}>
                    {member}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button 
              className={`nav-arrow ${currentGroupIndex === groups.length - 1 ? 'hidden' : ''}`} 
              onClick={handleNext}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

          </div>
        )}
      </main>
    </>
  );
}
