document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Performance Chart
    const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
    const portfolioChart = new Chart(portfolioCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Portfolio Value',
                data: [95000, 97500, 96800, 98200, 101500, 103200, 105800, 108500, 112000, 115600, 119800, 124500],
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointRadius: 3,
                tension: 0.4,
                fill: true
            }, {
                label: 'Benchmark (S&P 500)',
                data: [95000, 96200, 97500, 98100, 99800, 101200, 102500, 104800, 106200, 108500, 110200, 112800],
                borderColor: 'rgba(100, 116, 139, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(100, 116, 139, 0.8)',
                pointRadius: 2,
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(226, 232, 240, 0.7)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Expense Breakdown Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Other'],
            datasets: [{
                data: [1800, 850, 450, 320, 580, 420, 700],
                backgroundColor: [
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(96, 165, 250, 0.8)',
                    'rgba(147, 197, 253, 0.8)',
                    'rgba(30, 64, 175, 0.8)',
                    'rgba(17, 24, 39, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: $${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // Add interactivity to time filters
    const timeFilters = document.querySelectorAll('.time-filter span');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = this.parentElement.querySelectorAll('span');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // In a real app, this would trigger data refresh
            // For demo purposes, we'll just simulate a loading state
            const chartCard = this.closest('.chart-card');
            const canvas = chartCard.querySelector('canvas');
            
            // Add loading effect
            canvas.style.opacity = '0.5';
            setTimeout(() => {
                canvas.style.opacity = '1';
                // Here you would update the chart data
            }, 500);
        });
    });

    // Make nav items clickable
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            // In a real app, this would navigate to different sections
        });
    });

    // Add responsiveness to the dashboard
    function adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        const chartCards = document.querySelectorAll('.chart-card');
        
        if (width < 768) {
            chartCards.forEach(card => {
                const canvas = card.querySelector('canvas');
                canvas.height = 200;
            });
        } else {
            chartCards.forEach(card => {
                const canvas = card.querySelector('canvas');
                canvas.height = 250;
            });
        }
    }

    // Call once on load and add event listener for resize
    adjustLayoutForScreenSize();
    window.addEventListener('resize', adjustLayoutForScreenSize);

    // Simulate data loading for a real-world feel
    function simulateDataRefresh() {
        const cards = document.querySelectorAll('.card-value');
        cards.forEach(card => {
            const currentValue = parseFloat(card.textContent.replace(/[^0-9.-]+/g, ''));
            const randomChange = (Math.random() * 2 - 1) * (currentValue * 0.005); // Random change within ±0.5%
            let newValue;
            
            if (card.textContent.includes('%')) {
                newValue = (currentValue + randomChange).toFixed(1) + '%';
            } else {
                newValue = '$' + (currentValue + randomChange).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }
            
            // Animate the change
            card.style.transition = 'color 0.5s';
            card.style.color = randomChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
            setTimeout(() => {
                card.textContent = newValue;
                card.style.color = 'var(--text-primary)';
            }, 500);
        });
    }

    // Simulate periodic data updates
    setInterval(simulateDataRefresh, 30000); // Every 30 seconds
});