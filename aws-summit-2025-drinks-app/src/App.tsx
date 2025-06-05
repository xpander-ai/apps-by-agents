import React from 'react';
import './App.css';
import { drinkLocations } from './data/drinks';

function App() {
  return (
    <div className="App">
      <header className="header">
        <nav className="nav">
          <div className="logo">AWS Summit 2025</div>
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#locations">Drink Spots</a></li>
          </ul>
        </nav>
        <section id="hero" className="hero">
          <h1>AWS Summit 2025 Drinks Guide</h1>
          <p>Discover the best spots to grab a drink at AWS Summit 2025.</p>
        </section>
      </header>
      <main>
        <section id="locations" className="locations">
          {drinkLocations.map((location) => (
            <div key={location.id} className="location-card">
              <h2>{location.name}</h2>
              <p>{location.description}</p>
              {location.link && (
                <a href={location.link} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              )}
            </div>
          ))}
        </section>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AWS Summit 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
