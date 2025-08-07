(function () {
  const { useState, useEffect } = React;

  const DRINKS = ['Fanta Zero', 'Coke Zero', 'Soda', 'Water'];
  const BASE_EMOJIS = {
    'Fanta Zero': '🍊',
    'Coke Zero': '🥤',
    Soda: '🥤',
    Water: '💧',
  };
  const MOOD_EMOJIS = ['🙂', '😐', '😠'];

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d.toISOString().split('T')[0];
  }

  function loadData() {
    const data = JSON.parse(localStorage.getItem('drinkCounterData') || '{}');
    const today = new Date();
    const currentDay = today.toISOString().split('T')[0];
    const currentWeek = getWeekStart(today);
    const currentMonth = today.toISOString().slice(0, 7);

    const defaultCounts = DRINKS.reduce((acc, drink) => {
      acc[drink] = { daily: 0, weekly: 0, monthly: 0 };
      return acc;
    }, {});

    const lastReset = data.lastReset || {};
    if (lastReset.daily !== currentDay) {
      data.counts = defaultCounts;
      lastReset.daily = currentDay;
    }
    if (lastReset.weekly !== currentWeek) {
      data.counts = defaultCounts;
      lastReset.weekly = currentWeek;
    }
    if (lastReset.monthly !== currentMonth) {
      data.counts = defaultCounts;
      lastReset.monthly = currentMonth;
    }

    data.counts = data.counts || defaultCounts;
    data.lastReset = lastReset;

    localStorage.setItem('drinkCounterData', JSON.stringify(data));
    return data.counts;
  }

  function saveData(counts) {
    const data = JSON.parse(localStorage.getItem('drinkCounterData') || '{}');
    data.counts = counts;
    localStorage.setItem('drinkCounterData', JSON.stringify(data));
  }

  function DrinkCounter() {
    const [counts, setCounts] = useState(() => loadData());

    useEffect(() => {
      saveData(counts);
    }, [counts]);

    const handleClick = (drink) => {
      setCounts((prev) => {
        const updated = { ...prev };
        updated[drink] = {
          daily: prev[drink].daily + 1,
          weekly: prev[drink].weekly + 1,
          monthly: prev[drink].monthly + 1,
        };
        return updated;
      });
    };

    const getMoodEmoji = (drink) => {
      if (drink === 'Water') return BASE_EMOJIS[drink];
      const daily = counts[drink].daily;
      const idx = Math.min(Math.floor(daily / 3), MOOD_EMOJIS.length - 1);
      return BASE_EMOJIS[drink] + MOOD_EMOJIS[idx];
    };

    return React.createElement(
      'div',
      { className: 'container' },
      DRINKS.map((drink) =>
        React.createElement(
          'div',
          { key: drink, className: 'counter' },
          React.createElement(
            'button',
            { onClick: () => handleClick(drink) },
            getMoodEmoji(drink) + ' ' + drink
          ),
          React.createElement(
            'div',
            { className: 'counts' },
            React.createElement('span', null, `Daily: ${counts[drink].daily}`),
            React.createElement('span', null, `Weekly: ${counts[drink].weekly}`),
            React.createElement('span', null, `Monthly: ${counts[drink].monthly}`)
          )
        )
      )
    );
  }

  ReactDOM.render(
    React.createElement(DrinkCounter),
    document.getElementById('root')
  );
})();