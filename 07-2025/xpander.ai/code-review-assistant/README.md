# 🔍 Code Review Assistant

A powerful Streamlit web application that analyzes your code for best practices, common mistakes, and style issues. Get instant feedback on your Python and JavaScript code with detailed suggestions for improvement.

## ✨ Features

- **🐍 Python Analysis**: 
  - Syntax error detection
  - Best practices validation
  - Style guide compliance (PEP 8)
  - Documentation checks (missing docstrings)
  - Code smell detection (bare except clauses, global variables)
  
- **🟨 JavaScript Analysis**:
  - Modern JS practices (var vs let/const)
  - Equality operator suggestions (== vs ===)
  - Code style recommendations
  - Debug code detection (console.log)
  - Function declaration patterns

- **📊 Smart Analysis**:
  - Severity-based issue prioritization (High/Medium/Low)
  - Line-by-line issue location
  - Code quality metrics
  - Interactive expandable results
  - Clean, user-friendly interface

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip package manager

### Installation

1. **Clone or download the app files**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the application**:
   ```bash
   streamlit run app.py
   ```
4. **Open your browser** to `http://localhost:8501`

## 💻 Usage

1. **Select Language**: Choose between Python and JavaScript from the sidebar
2. **Paste Code**: Enter your code in the left text area
3. **Analyze**: The app automatically analyzes your code as you type or paste
4. **Review Results**: See issues and suggestions organized by severity in the right panel

### Sample Code
The app includes sample code for both languages to help you get started quickly. Click the "📋 Use Sample Code" button to load example code with intentional issues for demonstration.

## 🎯 Analysis Categories

### Issues (🚨)
Problems that should be addressed:
- **High Severity**: Syntax errors, critical bugs
- **Medium Severity**: Bad practices, potential issues
- **Low Severity**: Style violations, minor improvements

### Suggestions (💡)
Recommendations for code improvement:
- **Documentation**: Missing docstrings, comments
- **Modern Practices**: Updated syntax, better patterns
- **Style**: Formatting, naming conventions

## 📖 Code Analysis Details

### Python Analysis Includes:
- **Syntax Validation**: Parse code using AST to catch errors
- **Exception Handling**: Detect bare except clauses
- **Documentation**: Check for missing function docstrings  
- **Code Style**: Line length validation (PEP 8)
- **Design Patterns**: Global variable detection
- **Variable Naming**: Underscore prefix conventions

### JavaScript Analysis Includes:
- **Modern Syntax**: Recommend let/const over var
- **Equality**: Strict equality (===) recommendations
- **Debug Code**: Console.log statement detection
- **Style**: Line length and semicolon usage
- **Function Patterns**: Declaration vs expression suggestions

## 🛠️ Technical Details

### Built With
- **Streamlit**: Web application framework
- **Python AST**: Abstract syntax tree parsing for Python analysis
- **Regular Expressions**: Pattern matching for JavaScript analysis

### File Structure
```
code-review-assistant/
├── app.py              # Main Streamlit application
├── requirements.txt    # Python dependencies
└── README.md          # This documentation
```

## 🚀 Development

### Adding New Language Support
To add support for a new programming language:

1. Create an analysis function following the pattern:
   ```python
   def analyze_LANGUAGE_code(code: str) -> Dict[str, Any]:
       # Your analysis logic here
       return {
           "issues": issues,
           "suggestions": suggestions,
           "total_lines": len(code.split('\n')),
           "language": "LANGUAGE"
       }
   ```

2. Add the language to the selectbox options
3. Add the analysis call in the main function

### Extending Analysis Rules
Each analysis function returns issues and suggestions in this format:
```python
{
    "type": "Category Name",           # e.g., "Best Practice", "Style"
    "line": line_number,              # Line where issue occurs
    "message": "Description",         # Human-readable explanation
    "severity": "high|medium|low"     # Priority level
}
```

## 📝 Example Output

When analyzing code, you'll see:

### Summary Metrics
- Total lines of code
- Number of issues found
- Number of suggestions provided

### Detailed Results
- **Line-specific feedback**: Each issue shows the exact line number
- **Categorized by type**: Issues grouped by category (Style, Best Practice, etc.)
- **Severity indicators**: Color-coded priority levels
- **Expandable details**: Click to see full explanations

## 🤝 Contributing

This app was created as part of the Apps by Agents initiative. Feel free to:
- Report bugs or issues
- Suggest new features
- Submit improvements
- Add support for additional programming languages

## 📄 License

This project is part of the Apps by Agents repository and follows the repository's licensing terms.

## 🔗 Links

- [Apps by Agents Homepage](https://apps-by-agents.xpander.me/)
- [View All Agent-Generated Apps](https://apps-by-agents.xpander.me/projects.html)

---

*Built with ❤️ by AI Agent as part of the Apps by Agents workshop series*