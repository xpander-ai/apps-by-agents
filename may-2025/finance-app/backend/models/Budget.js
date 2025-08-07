const mongoose = require('mongoose');

const BudgetCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'housing', 'transportation', 'food', 'utilities', 
      'insurance', 'healthcare', 'debt', 'entertainment', 
      'personal', 'education', 'savings', 'gifts', 'other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

// Calculate remaining budget
BudgetCategorySchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

// Calculate percentage spent
BudgetCategorySchema.virtual('percentageSpent').get(function() {
  if (this.amount === 0) return 0;
  return (this.spent / this.amount) * 100;
});

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  categories: [BudgetCategorySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate total spent
BudgetSchema.virtual('totalSpent').get(function() {
  return this.categories.reduce((total, category) => total + category.spent, 0);
});

// Calculate total remaining
BudgetSchema.virtual('totalRemaining').get(function() {
  return this.totalBudget - this.totalSpent;
});

// Calculate percentage of total budget spent
BudgetSchema.virtual('percentageSpent').get(function() {
  if (this.totalBudget === 0) return 0;
  return (this.totalSpent / this.totalBudget) * 100;
});

// Enable virtuals in JSON
BudgetSchema.set('toJSON', { virtuals: true });
BudgetCategorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Budget', BudgetSchema);