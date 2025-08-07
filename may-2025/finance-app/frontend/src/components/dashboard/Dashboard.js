import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import SocketContext from '../../context/socket/socketContext';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [marketHistory, setMarketHistory] = useState([]);
  
  // Fetch initial data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch portfolio summary
        const portfolioRes = await axios.get('/api/dashboard/portfolio-summary');
        setPortfolioData(portfolioRes.data);
        
        // Fetch expense summary
        const expenseRes = await axios.get('/api/dashboard/expense-summary');
        setExpenseData(expenseRes.data);
        
        // Fetch budget summary
        const budgetRes = await axios.get('/api/dashboard/budget-summary');
        setBudgetData(budgetRes.data);
        
        setLoading(false);
      } catch (err) {
        setAlert(err.response?.data?.message || 'Failed to load dashboard data', 'danger');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [setAlert]);
  
  // Set up socket for real-time market data
  useEffect(() => {
    if (socket) {
      // Subscribe to market data
      socket.emit('subscribe-market-data');
      
      // Listen for market updates
      socket.on('market-update', (data) => {
        setMarketData(data);
        
        // Add to history (keep last 10 points)
        setMarketHistory(prev => {
          const newHistory = [...prev, data];
          if (newHistory.length > 10) {
            return newHistory.slice(newHistory.length - 10);
          }
          return newHistory;
        });
      });
      
      // Clean up on unmount
      return () => {
        socket.off('market-update');
      };
    }
  }, [socket]);
  
  if (loading) {
    return <Spinner />;
  }
  
  // Prepare chart data
  const portfolioChartData = {
    labels: portfolioData?.assetAllocation.map(item => item.category) || [],
    datasets: [
      {
        data: portfolioData?.assetAllocation.map(item => item.value) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const expenseChartData = {
    labels: expenseData?.categories.map(item => item.category) || [],
    datasets: [
      {
        data: expenseData?.categories.map(item => item.amount) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const marketChartData = {
    labels: marketHistory.map(data => {
      const date = new Date(data.timestamp);
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }),
    datasets: [
      {
        label: 'S&P 500',
        data: marketHistory.map(data => data.indices.sp500),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      },
      {
        label: 'NASDAQ',
        data: marketHistory.map(data => data.indices.nasdaq),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      },
      {
        label: 'Dow Jones',
        data: marketHistory.map(data => data.indices.dowJones),
        borderColor: '#FFCE56',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>
      <p className="welcome-message">Welcome back, {user?.name}!</p>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Portfolio Value</h3>
          <p className="summary-value">${portfolioData?.totalValue.toLocaleString()}</p>
          <p className={`summary-change ${portfolioData?.totalChange >= 0 ? 'positive' : 'negative'}`}>
            {portfolioData?.totalChange >= 0 ? '▲' : '▼'} ${Math.abs(portfolioData?.totalChange).toLocaleString()} ({Math.abs(portfolioData?.totalChangePercent).toFixed(2)}%)
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Monthly Expenses</h3>
          <p className="summary-value">${expenseData?.totalMonthly.toLocaleString()}</p>
          <p className={`summary-change ${expenseData?.monthlyChange <= 0 ? 'positive' : 'negative'}`}>
            {expenseData?.monthlyChange <= 0 ? '▼' : '▲'} ${Math.abs(expenseData?.monthlyChange).toLocaleString()} ({Math.abs(expenseData?.monthlyChangePercent).toFixed(2)}%)
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Budget Status</h3>
          <p className="summary-value">${budgetData?.remaining.toLocaleString()} remaining</p>
          <div className="budget-progress">
            <div 
              className="budget-progress-bar" 
              style={{ 
                width: `${budgetData?.percentSpent}%`,
                backgroundColor: budgetData?.percentSpent > 90 ? '#FF6384' : budgetData?.percentSpent > 75 ? '#FFCE56' : '#4BC0C0'
              }}
            ></div>
          </div>
          <p className="budget-percent">{budgetData?.percentSpent.toFixed(0)}% spent</p>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Portfolio Allocation</h3>
          <div className="chart">
            <Pie data={portfolioChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          <div className="chart">
            <Pie data={expenseChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      
      <div className="market-data">
        <h3>Market Overview</h3>
        
        {marketData ? (
          <>
            <div className="indices">
              <div className="index-card">
                <h4>S&P 500</h4>
                <p className="index-value">{marketData.indices.sp500.toLocaleString()}</p>
              </div>
              
              <div className="index-card">
                <h4>NASDAQ</h4>
                <p className="index-value">{marketData.indices.nasdaq.toLocaleString()}</p>
              </div>
              
              <div className="index-card">
                <h4>Dow Jones</h4>
                <p className="index-value">{marketData.indices.dowJones.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="market-chart">
              <Line 
                data={marketChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false
                    }
                  }
                }} 
              />
            </div>
            
            <div className="top-movers">
              <h4>Top Movers</h4>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.topMovers.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.symbol}</td>
                      <td>${stock.price.toFixed(2)}</td>
                      <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Loading market data...</p>
        )}
      </div>
      
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {expenseData?.recentTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className="amount">${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;