const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  assetType: {
    type: String,
    enum: ['stock', 'etf', 'crypto', 'bond', 'mutual_fund', 'other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  currentPrice: {
    type: Number,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate current value
AssetSchema.virtual('currentValue').get(function() {
  return this.quantity * (this.currentPrice || this.purchasePrice);
});

// Calculate profit/loss
AssetSchema.virtual('profitLoss').get(function() {
  if (!this.currentPrice) return 0;
  return (this.currentPrice - this.purchasePrice) * this.quantity;
});

// Calculate profit/loss percentage
AssetSchema.virtual('profitLossPercentage').get(function() {
  if (!this.currentPrice || this.purchasePrice === 0) return 0;
  return ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'Main Portfolio'
  },
  assets: [AssetSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate total portfolio value
PortfolioSchema.virtual('totalValue').get(function() {
  return this.assets.reduce((total, asset) => {
    return total + asset.quantity * (asset.currentPrice || asset.purchasePrice);
  }, 0);
});

// Calculate total portfolio cost basis
PortfolioSchema.virtual('costBasis').get(function() {
  return this.assets.reduce((total, asset) => {
    return total + asset.quantity * asset.purchasePrice;
  }, 0);
});

// Calculate total profit/loss
PortfolioSchema.virtual('totalProfitLoss').get(function() {
  return this.assets.reduce((total, asset) => {
    if (!asset.currentPrice) return total;
    return total + (asset.currentPrice - asset.purchasePrice) * asset.quantity;
  }, 0);
});

// Calculate total profit/loss percentage
PortfolioSchema.virtual('totalProfitLossPercentage').get(function() {
  const costBasis = this.costBasis;
  if (costBasis === 0) return 0;
  return (this.totalProfitLoss / costBasis) * 100;
});

// Enable virtuals in JSON
PortfolioSchema.set('toJSON', { virtuals: true });
AssetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);