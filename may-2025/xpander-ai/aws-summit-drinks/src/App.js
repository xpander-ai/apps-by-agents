import React from 'react';
import Navbar from './components/Navbar';
import DrinkList from './components/DrinkList';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <h1>AWS Summit 2025: Best Drinks Guide</h1>
        <DrinkList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
