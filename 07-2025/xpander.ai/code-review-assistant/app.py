import streamlit as st
import re
import ast
import json
from typing import List, Dict, Any

def analyze_python_code(code: str) -> Dict[str, Any]:
    """Analyze Python code for best practices and common issues."""
    issues = []
    suggestions = []
    
    try:
        tree = ast.parse(code)
        
        # Check for common Python issues
        for node in ast.walk(tree):
            # Check for bare except clauses
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                issues.append({
                    "type": "Bad Practice",
                    "line": node.lineno if hasattr(node, 'lineno') else 0,
                    "message": "Bare except clause - should specify exception type",
                    "severity": "medium"
                })
            
            # Check for unused variables (basic check for assignments)
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id.startswith('_'):
                        suggestions.append({
                            "type": "Style",
                            "line": node.lineno if hasattr(node, 'lineno') else 0,
                            "message": f"Variable '{target.id}' starts with underscore - consider if it's intentionally private",
                            "severity": "low"
                        })
        
        # Check for long lines
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if len(line) > 79:
                issues.append({
                    "type": "Style",
                    "line": i,
                    "message": f"Line too long ({len(line)} > 79 characters) - consider breaking it up",
                    "severity": "low"
                })
        
        # Check for missing docstrings in functions
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if not ast.get_docstring(node):
                    suggestions.append({
                        "type": "Documentation",
                        "line": node.lineno if hasattr(node, 'lineno') else 0,
                        "message": f"Function '{node.name}' is missing a docstring",
                        "severity": "medium"
                    })
        
        # Check for global variables
        for node in ast.walk(tree):
            if isinstance(node, ast.Global):
                issues.append({
                    "type": "Design",
                    "line": node.lineno if hasattr(node, 'lineno') else 0,
                    "message": "Global variables found - consider using function parameters or class attributes",
                    "severity": "medium"
                })
    
    except SyntaxError as e:
        issues.append({
            "type": "Syntax Error",
            "line": e.lineno or 0,
            "message": f"Syntax error: {e.msg}",
            "severity": "high"
        })
    
    return {
        "issues": issues,
        "suggestions": suggestions,
        "total_lines": len(code.split('\n')),
        "language": "Python"
    }

def analyze_javascript_code(code: str) -> Dict[str, Any]:
    """Analyze JavaScript code for best practices and common issues."""
    issues = []
    suggestions = []
    lines = code.split('\n')
    
    # Basic regex-based analysis for JavaScript
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        
        # Check for var usage
        if re.search(r'\bvar\s+', line):
            suggestions.append({
                "type": "Modern JS",
                "line": i,
                "message": "Consider using 'let' or 'const' instead of 'var'",
                "severity": "medium"
            })
        
        # Check for == instead of ===
        if re.search(r'[^=!]==[^=]', line):
            issues.append({
                "type": "Best Practice",
                "line": i,
                "message": "Use strict equality (===) instead of loose equality (==)",
                "severity": "medium"
            })
        
        # Check for console.log in production code
        if 'console.log' in line:
            suggestions.append({
                "type": "Debug Code",
                "line": i,
                "message": "Remove console.log statements in production code",
                "severity": "low"
            })
        
        # Check for long lines
        if len(line) > 80:
            issues.append({
                "type": "Style",
                "line": i,
                "message": f"Line too long ({len(line)} > 80 characters) - consider breaking it up",
                "severity": "low"
            })
        
        # Check for missing semicolons (basic check)
        if line_stripped and not line_stripped.endswith((';', '{', '}', ')', ',')) and not line_stripped.startswith(('if', 'for', 'while', 'function', '//')):
            if not re.search(r'^\s*(return|break|continue)\s', line_stripped):
                suggestions.append({
                    "type": "Style",
                    "line": i,
                    "message": "Consider adding semicolon at end of statement",
                    "severity": "low"
                })
        
        # Check for function declarations vs expressions
        if re.search(r'^\s*function\s+\w+', line):
            suggestions.append({
                "type": "Modern JS",
                "line": i,
                "message": "Consider using arrow functions or function expressions for consistency",
                "severity": "low"
            })
    
    return {
        "issues": issues,
        "suggestions": suggestions,
        "total_lines": len(lines),
        "language": "JavaScript"
    }

def get_severity_color(severity: str) -> str:
    """Return color for severity level."""
    colors = {
        "high": "🔴",
        "medium": "🟡", 
        "low": "🟢"
    }
    return colors.get(severity, "⚪")

def display_analysis_results(analysis: Dict[str, Any]):
    """Display code analysis results in a nice format."""
    st.subheader(f"📊 Analysis Results for {analysis['language']}")
    
    # Summary metrics
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Lines", analysis['total_lines'])
    with col2:
        st.metric("Issues Found", len(analysis['issues']))
    with col3:
        st.metric("Suggestions", len(analysis['suggestions']))
    
    # Issues section
    if analysis['issues']:
        st.subheader("🚨 Issues Found")
        for issue in sorted(analysis['issues'], key=lambda x: x['line']):
            severity_icon = get_severity_color(issue['severity'])
            with st.expander(f"{severity_icon} Line {issue['line']}: {issue['type']} ({issue['severity'].title()})"):
                st.write(f"**Message:** {issue['message']}")
                st.write(f"**Type:** {issue['type']}")
                st.write(f"**Severity:** {issue['severity'].title()}")
    
    # Suggestions section
    if analysis['suggestions']:
        st.subheader("💡 Suggestions")
        for suggestion in sorted(analysis['suggestions'], key=lambda x: x['line']):
            severity_icon = get_severity_color(suggestion['severity'])
            with st.expander(f"{severity_icon} Line {suggestion['line']}: {suggestion['type']} ({suggestion['severity'].title()})"):
                st.write(f"**Suggestion:** {suggestion['message']}")
                st.write(f"**Type:** {suggestion['type']}")
                st.write(f"**Priority:** {suggestion['severity'].title()}")
    
    # Overall score
    total_items = len(analysis['issues']) + len(analysis['suggestions'])
    if total_items == 0:
        st.success("🎉 Excellent! No issues found in your code.")
    else:
        high_severity = len([x for x in analysis['issues'] + analysis['suggestions'] if x['severity'] == 'high'])
        medium_severity = len([x for x in analysis['issues'] + analysis['suggestions'] if x['severity'] == 'medium'])
        low_severity = len([x for x in analysis['issues'] + analysis['suggestions'] if x['severity'] == 'low'])
        
        if high_severity > 0:
            st.error(f"⚠️ Code needs attention: {high_severity} high-priority issues found")
        elif medium_severity > 0:
            st.warning(f"⚡ Code can be improved: {medium_severity} medium-priority items found")
        else:
            st.info(f"✨ Code looks good: Only {low_severity} minor suggestions")

def main():
    st.set_page_config(
        page_title="Code Review Assistant",
        page_icon="🔍",
        layout="wide"
    )
    
    st.title("🔍 Code Review Assistant")
    st.markdown("**Analyze your code for best practices, common mistakes, and style issues**")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("⚙️ Settings")
        language = st.selectbox(
            "Select Language",
            ["Python", "JavaScript"],
            index=0
        )
        
        st.markdown("---")
        st.markdown("### 📖 About")
        st.markdown("""
        This tool analyzes your code and provides:
        - **Issues**: Problems that should be fixed
        - **Suggestions**: Improvements to consider
        - **Best Practices**: Following language conventions
        """)
        
        st.markdown("### 🎯 Supported Languages")
        st.markdown("- 🐍 Python")
        st.markdown("- 🟨 JavaScript")
    
    # Main content area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader(f"📝 Paste Your {language} Code")
        
        # Sample code for demonstration
        if language == "Python":
            sample_code = '''def calculate_total(items):
    total = 0
    for item in items:
        try:
            total += item.price * item.quantity
        except:
            print("Error processing item")
    return total

# Global variable
TAX_RATE = 0.08

def process_order(items):
    subtotal = calculate_total(items)
    tax = subtotal * TAX_RATE
    return subtotal + tax'''
        else:
            sample_code = '''function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i].price == undefined) {
            console.log("Price is undefined for item", i);
            continue
        }
        total += items[i].price * items[i].quantity
    }
    return total
}

function processOrder(items) {
    const subtotal = calculateTotal(items);
    const taxRate = 0.08
    return subtotal + (subtotal * taxRate);
}'''
        
        code_input = st.text_area(
            f"Enter your {language} code here:",
            value="",
            height=400,
            placeholder=f"Paste your {language} code here or use the sample code button below..."
        )
        
        col_btn1, col_btn2 = st.columns(2)
        with col_btn1:
            if st.button("📋 Use Sample Code"):
                st.session_state.sample_code = sample_code
                st.rerun()
        
        with col_btn2:
            if st.button("🧹 Clear Code"):
                st.session_state.clear_code = True
                st.rerun()
        
        # Handle session state updates
        if hasattr(st.session_state, 'sample_code'):
            code_input = st.session_state.sample_code
            del st.session_state.sample_code
        
        if hasattr(st.session_state, 'clear_code'):
            code_input = ""
            del st.session_state.clear_code
    
    with col2:
        st.subheader("🔍 Analysis Results")
        
        if code_input.strip():
            with st.spinner("Analyzing your code..."):
                if language == "Python":
                    analysis = analyze_python_code(code_input)
                else:
                    analysis = analyze_javascript_code(code_input)
                
                display_analysis_results(analysis)
        else:
            st.info("👈 Enter some code in the left panel to see the analysis results here!")
            
            # Show feature preview
            st.markdown("### 🌟 What You'll Get:")
            st.markdown("""
            - **🚨 Issue Detection**: Find syntax errors, bad practices, and potential bugs
            - **💡 Smart Suggestions**: Get actionable recommendations for improvement
            - **📊 Code Metrics**: See line count and overall code quality score
            - **🎯 Severity Levels**: Issues prioritized by importance (High/Medium/Low)
            - **📍 Line-by-Line**: Exact locations of issues and suggestions
            """)

if __name__ == "__main__":
    main()