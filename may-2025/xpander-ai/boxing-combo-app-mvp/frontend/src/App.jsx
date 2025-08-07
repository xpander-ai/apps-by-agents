import React, { useState } from 'react';
import './App.css';

const AVAILABLE_STRIKES = ['Jab', 'Cross', 'Hook', 'Uppercut'];

function App() {
  const [selectedStrikes, setSelectedStrikes] = useState([...AVAILABLE_STRIKES]);
  const [comboLength, setComboLength] = useState(3);
  const [combo, setCombo] = useState([]);

  const generateCombo = () => {
    const newCombo = [];
    for (let i = 0; i < comboLength; i++) {
      const randomIndex = Math.floor(Math.random() * selectedStrikes.length);
      newCombo.push(selectedStrikes[randomIndex]);
    }
    setCombo(newCombo);
  };

  const toggleStrike = (strike) => {
    if (selectedStrikes.includes(strike)) {
      setSelectedStrikes(selectedStrikes.filter((s) => s !== strike));
    } else {
      setSelectedStrikes([...selectedStrikes, strike]);
    }
  };

  const handleLengthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setComboLength(value);
    }
  };

  return (
    <div className="container">
      <h1>Boxing Combo Generator</h1>
      <div className="controls">
        <div>
          <h2>Select Strikes</h2>
          {AVAILABLE_STRIKES.map((strike) => (
            <label key={strike}>
              <input
                type="checkbox"
                checked={selectedStrikes.includes(strike)}
                onChange={() => toggleStrike(strike)}
              />
              {strike}
            </label>
          ))}
        </div>
        <div>
          <h2>Combo Length</h2>
          <input
            type="number"
            min="1"
            value={comboLength}
            onChange={handleLengthChange}
          />
        </div>
      </div>
      <button onClick={generateCombo}>Generate Combo</button>
      <div className="combo-display">
        <h2>Combo</h2>
        <p>{combo.length > 0 ? combo.join(' - ') : 'Click "Generate Combo" to start'}</p>
      </div>
    </div>
  );
}

export default App;