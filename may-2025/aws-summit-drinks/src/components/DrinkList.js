import React from 'react';
import { drinks } from '../data/mockDrinks';
import './DrinkList.css';

const DrinkList = () => (
  <section className="drink-list">
    {drinks.map((drink, idx) => (
      <div key={idx} className="drink-list__item">
        <h2 className="drink-list__name">{drink.name}</h2>
        <p className="drink-list__description">{drink.description}</p>
        <p className="drink-list__location">{drink.location}</p>
      </div>
    ))}
  </section>
);

export default DrinkList;