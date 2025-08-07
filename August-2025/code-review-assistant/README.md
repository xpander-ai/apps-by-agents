# 🔍 Code Review Assistant

A Streamlit web application that analyzes code snippets for best practices and provides instant feedback to improve code quality.

## Features

- **Multi-language Support**: Currently supports Python and JavaScript
- **Auto-detection**: Automatically detects the programming language
- **Best Practice Analysis**: Checks for:
  - Naming conventions (snake_case, camelCase, PascalCase)
  - Code structure and organization
  - Security vulnerabilities
  - Documentation standards
- **Interactive UI**: Easy-to-use web interface with real-time feedback
- **Detailed Reports**: Shows issues with line numbers and improvement suggestions

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd August-2025/code-review-assistant
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
streamlit run app.py
```

## Usage

1. Open your web browser and navigate to the displayed URL (usually `http://localhost:8501`)
2. Paste your code snippet in the text area
3. Select the programming language (or use auto-detect)
4. Click "🔍 Review Code" to analyze your code
5. Review the feedback and suggestions in the results panel

## Supported Languages

### Python
- ✅ Naming conventions (snake_case functions, PascalCase classes)
- ✅ Code structure (docstrings, imports)
- ✅ Security checks (SQL injection, hardcoded secrets, eval usage)
- ✅ Line length recommendations

### JavaScript
- ✅ Naming conventions (camelCase variables, PascalCase classes)
- ✅ Code structure (semicolons, strict mode)
- ✅ Security checks (eval usage, innerHTML XSS risks)

## Code Review Categories

### 🚨 Errors (High Priority)
- Security vulnerabilities
- Critical best practice violations

### ⚠️ Warnings (Medium Priority)
- Code structure improvements
- Performance considerations

### ℹ️ Info (Low Priority)
- Style recommendations
- Documentation suggestions

## Examples

### Good Python Code
```python
def calculate_total_price(items: List[float], tax_rate: float = 0.08) -> float:
    """
    Calculate total price including tax.
    
    Args:
        items: List of item prices
        tax_rate: Tax rate (default 8%)
        
    Returns:
        Total price with tax
    """
    subtotal = sum(items)
    tax = subtotal * tax_rate
    return subtotal + tax
```

### Good JavaScript Code
```javascript
"use strict";

class ShoppingCart {
    constructor() {
        this.items = [];
        this.taxRate = 0.08;
    }
    
    addItem(item) {
        this.items.push(item);
    }
    
    calculateTotal() {
        const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
        return subtotal * (1 + this.taxRate);
    }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Future Enhancements

- [ ] Support for more programming languages (Java, C++, Go)
- [ ] Integration with popular linters (ESLint, Pylint)
- [ ] Custom rule configuration
- [ ] Code formatting suggestions
- [ ] Performance analysis
- [ ] Code complexity metrics

## License

This project is part of the Apps by Agents repository and follows the same licensing terms.

## Support

If you encounter any issues or have suggestions for improvements, please open an issue in the repository.