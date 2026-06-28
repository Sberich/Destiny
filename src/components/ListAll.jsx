import React, { useState } from 'react';

export default function ListAll({ SidebarWrapper }) {
  const [inputType, setInputType] = useState('numbers');
  const [namesText, setNamesText] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [items, setItems] = useState([]);

  const getItemsList = () => {
    if (inputType === 'names') {
      return namesText.split('\n').map(n => n.trim()).filter(n => n);
    }
    const arr = [];
    for (let i = min; i <= max; i++) arr.push(i);
    return arr;
  };

  const handleGenerateList = () => {
    const listItems = getItemsList();
    if (listItems.length === 0) {
      alert("Please provide some names.");
      return;
    }
    if (inputType === 'numbers' && min > max) {
      alert("From number must be less than or equal to To number.");
      return;
    }

    const arr = [...listItems];
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setItems(arr);
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

        <button className="btn-primary" onClick={handleGenerateList}>Generate List</button>
      </SidebarWrapper>

      <main className="stage">
        {items.length === 0 ? (
          <div className="stage-center">
            <div className="cool-hint" style={{ marginTop: 0 }}>SETUP AND GENERATE</div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '2rem' }}>
            <div className="mega-grid">
              {items.map((item, idx) => (
                <div key={idx} className="mega-chip" style={{ animationDelay: `${(idx % 20) * 0.03}s` }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
