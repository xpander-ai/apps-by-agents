const express = require('express');
const { body, validationResult } = require('express-validator');
const Portfolio = require('../models/Portfolio');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/portfolio
// @desc    Get user's portfolios
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id });
    res.json(portfolios);
  } catch (error) {
    console.error('Get portfolios error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/portfolio/:id
// @desc    Get a specific portfolio
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/portfolio
// @desc    Create a new portfolio
// @access  Private
router.post(
  '/',
  [
    authenticate,
    body('name', 'Portfolio name is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { name } = req.body;
      
      // Create new portfolio
      const portfolio = new Portfolio({
        user: req.user.id,
        name
      });
      
      await portfolio.save();
      res.json(portfolio);
    } catch (error) {
      console.error('Create portfolio error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/portfolio/:id
// @desc    Update a portfolio
// @access  Private
router.put(
  '/:id',
  [
    authenticate,
    body('name', 'Portfolio name is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { name } = req.body;
      
      // Find and update portfolio
      let portfolio = await Portfolio.findOne({
        _id: req.params.id,
        user: req.user.id
      });
      
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      
      portfolio.name = name;
      portfolio.lastUpdated = Date.now();
      
      await portfolio.save();
      res.json(portfolio);
    } catch (error) {
      console.error('Update portfolio error:', error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/portfolio/:id
// @desc    Delete a portfolio
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Find and delete portfolio
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    await portfolio.remove();
    res.json({ message: 'Portfolio removed' });
  } catch (error) {
    console.error('Delete portfolio error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/portfolio/:id/asset
// @desc    Add an asset to a portfolio
// @access  Private
router.post(
  '/:id/asset',
  [
    authenticate,
    body('symbol', 'Symbol is required').not().isEmpty(),
    body('name', 'Name is required').not().isEmpty(),
    body('assetType', 'Asset type is required').isIn(['stock', 'etf', 'crypto', 'bond', 'mutual_fund', 'other']),
    body('quantity', 'Quantity must be a positive number').isFloat({ min: 0 }),
    body('purchasePrice', 'Purchase price must be a positive number').isFloat({ min: 0 }),
    body('purchaseDate', 'Purchase date is required').isISO8601()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { symbol, name, assetType, quantity, purchasePrice, purchaseDate, currentPrice } = req.body;
      
      // Find portfolio
      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        user: req.user.id
      });
      
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      
      // Create new asset
      const newAsset = {
        symbol,
        name,
        assetType,
        quantity,
        purchasePrice,
        purchaseDate,
        currentPrice: currentPrice || purchasePrice
      };
      
      // Add asset to portfolio
      portfolio.assets.push(newAsset);
      portfolio.lastUpdated = Date.now();
      
      await portfolio.save();
      res.json(portfolio);
    } catch (error) {
      console.error('Add asset error:', error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/portfolio/:portfolioId/asset/:assetId
// @desc    Update an asset in a portfolio
// @access  Private
router.put(
  '/:portfolioId/asset/:assetId',
  [
    authenticate,
    body('quantity', 'Quantity must be a positive number').optional().isFloat({ min: 0 }),
    body('currentPrice', 'Current price must be a positive number').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Find portfolio
      const portfolio = await Portfolio.findOne({
        _id: req.params.portfolioId,
        user: req.user.id
      });
      
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      
      // Find asset
      const asset = portfolio.assets.id(req.params.assetId);
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
      
      // Update asset fields
      const { quantity, currentPrice } = req.body;
      if (quantity !== undefined) asset.quantity = quantity;
      if (currentPrice !== undefined) asset.currentPrice = currentPrice;
      
      asset.lastUpdated = Date.now();
      portfolio.lastUpdated = Date.now();
      
      await portfolio.save();
      res.json(portfolio);
    } catch (error) {
      console.error('Update asset error:', error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio or asset not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/portfolio/:portfolioId/asset/:assetId
// @desc    Delete an asset from a portfolio
// @access  Private
router.delete('/:portfolioId/asset/:assetId', authenticate, async (req, res) => {
  try {
    // Find portfolio
    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Find and remove asset
    const asset = portfolio.assets.id(req.params.assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    asset.remove();
    portfolio.lastUpdated = Date.now();
    
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Delete asset error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Portfolio or asset not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;