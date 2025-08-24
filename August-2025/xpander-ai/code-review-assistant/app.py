import streamlit as st
import re
import ast
import tokenize
from io import StringIO
from typing import List, Dict, Any
import json

class CodeAnalyzer:
    def __init__(self):
        self.issues = []
        
    def analyze_python_code(self, code: str) -> List[Dict[str, Any]]:
        """Analyze Python code for best practices and potential issues."""
        self.issues = []
        
        try:
            # Parse the code into an AST
            tree = ast.parse(code)
            
            # Check for various code quality issues
            self._check_function_length(tree)
            self._check_variable_naming(tree)
            self._check_imports(tree)
            self._check_docstrings(tree)
            self._check_complexity(tree)
            self._check_unused_variables(code)
            
        except SyntaxError as e:
            self.issues.append({
                'type': 'error',
                'severity': 'high',
                'line': e.lineno,
                'message': f'Syntax Error: {e.msg}',
                'suggestion': 'Fix the syntax error before proceeding with analysis.'
            })
        
        return self.issues
    
    def _check_function_length(self, tree):
        """Check for overly long functions."""
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if hasattr(node, 'end_lineno'):
                    length = node.end_lineno - node.lineno
                    if length > 50:
                        self.issues.append({
                            'type': 'maintainability',
                            'severity': 'medium',
                            'line': node.lineno,
                            'message': f'Function "{node.name}" is {length} lines long',
                            'suggestion': 'Consider breaking down large functions into smaller, more focused functions.'
                        })
    
    def _check_variable_naming(self, tree):
        """Check for proper variable naming conventions."""
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                name = node.name
                if isinstance(node, ast.FunctionDef):
                    if not re.match(r'^[a-z_][a-z0-9_]*$', name):
                        self.issues.append({
                            'type': 'style',
                            'severity': 'low',
                            'line': node.lineno,
                            'message': f'Function name "{name}" should use snake_case',
                            'suggestion': 'Use snake_case for function names (e.g., my_function).'
                        })
                elif isinstance(node, ast.ClassDef):
                    if not re.match(r'^[A-Z][a-zA-Z0-9]*$', name):
                        self.issues.append({
                            'type': 'style',
                            'severity': 'low',
                            'line': node.lineno,
                            'message': f'Class name "{name}" should use PascalCase',
                            'suggestion': 'Use PascalCase for class names (e.g., MyClass).'
                        })
    
    def _check_imports(self, tree):
        """Check for import best practices."""
        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                if node.module and '*' in [alias.name for alias in node.names]:
                    self.issues.append({
                        'type': 'style',
                        'severity': 'medium',
                        'line': node.lineno,
                        'message': 'Wildcard import detected',
                        'suggestion': 'Use explicit imports instead of wildcard imports to avoid namespace pollution.'
                    })
    
    def _check_docstrings(self, tree):
        """Check for missing docstrings."""
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                if not ast.get_docstring(node):
                    entity_type = "Function" if isinstance(node, ast.FunctionDef) else "Class"
                    if not node.name.startswith('_'):  # Skip private methods
                        self.issues.append({
                            'type': 'documentation',
                            'severity': 'low',
                            'line': node.lineno,
                            'message': f'{entity_type} "{node.name}" is missing a docstring',
                            'suggestion': f'Add a docstring to describe what this {entity_type.lower()} does.'
                        })
    
    def _check_complexity(self, tree):
        """Check for high cyclomatic complexity."""
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                complexity = self._calculate_complexity(node)
                if complexity > 10:
                    self.issues.append({
                        'type': 'complexity',
                        'severity': 'high',
                        'line': node.lineno,
                        'message': f'Function "{node.name}" has high cyclomatic complexity ({complexity})',
                        'suggestion': 'Consider breaking down complex functions and reducing nested conditions.'
                    })
    
    def _calculate_complexity(self, node):
        """Calculate cyclomatic complexity for a function."""
        complexity = 1
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        return complexity
    
    def _check_unused_variables(self, code):
        """Basic check for potentially unused variables."""
        lines = code.split('\n')
        defined_vars = set()
        used_vars = set()
        
        for i, line in enumerate(lines, 1):
            # Simple regex-based detection (not perfect but useful)
            assignments = re.findall(r'^\s*([a-zA-Z_]\w*)\s*=', line)
            for var in assignments:
                if not var.startswith('_'):  # Skip private variables
                    defined_vars.add((var, i))
            
            # Find variable usage
            used_in_line = re.findall(r'\b([a-zA-Z_]\w*)\b', line)
            used_vars.update(used_in_line)
        
        for var, line_num in defined_vars:
            if var not in used_vars:
                self.issues.append({
                    'type': 'unused',
                    'severity': 'low',
                    'line': line_num,
                    'message': f'Variable "{var}" appears to be unused',
                    'suggestion': 'Remove unused variables or use them appropriately.'
                })

    def analyze_javascript_code(self, code: str) -> List[Dict[str, Any]]:
        """Analyze JavaScript code for basic best practices."""
        self.issues = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            
            # Check for console.log statements
            if 'console.log' in stripped and not stripped.startswith('//'):
                self.issues.append({
                    'type': 'debug',
                    'severity': 'low',
                    'line': i,
                    'message': 'Console.log statement found',
                    'suggestion': 'Remove console.log statements in production code.'
                })
            
            # Check for var usage instead of let/const
            if re.match(r'^\s*var\s+', stripped):
                self.issues.append({
                    'type': 'style',
                    'severity': 'medium',
                    'line': i,
                    'message': 'Use of "var" keyword detected',
                    'suggestion': 'Use "let" or "const" instead of "var" for better scoping.'
                })
            
            # Check for == instead of ===
            if '==' in stripped and '===' not in stripped and '!=' in stripped and '!==' not in stripped:
                self.issues.append({
                    'type': 'style',
                    'severity': 'medium',
                    'line': i,
                    'message': 'Loose equality operator (==) detected',
                    'suggestion': 'Use strict equality (===) for more predictable comparisons.'
                })
        
        return self.issues

def main():
    st.set_page_config(
        page_title="Code Review Assistant",
        page_icon="🔍",
        layout="wide"
    )
    
    st.title("🔍 Code Review Assistant")
    st.markdown("*An AI-powered tool to analyze your code for best practices and potential improvements*")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        language = st.selectbox(
            "Select Programming Language",
            ["Python", "JavaScript"],
            help="Choose the programming language of your code"
        )
        
        severity_filter = st.multiselect(
            "Filter by Severity",
            ["high", "medium", "low"],
            default=["high", "medium", "low"],
            help="Select which severity levels to display"
        )
        
        issue_types = st.multiselect(
            "Filter by Issue Type",
            ["error", "style", "maintainability", "complexity", "documentation", "unused", "debug"],
            default=["error", "style", "maintainability", "complexity", "documentation", "unused", "debug"],
            help="Select which types of issues to display"
        )
    
    # Main content area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📝 Code Input")
        code_input = st.text_area(
            "Paste your code here:",
            height=400,
            placeholder="Enter your code here for analysis...",
            help="Paste the code you want to review"
        )
        
        analyze_button = st.button("🔍 Analyze Code", type="primary")
    
    with col2:
        st.header("📊 Analysis Results")
        
        if analyze_button and code_input.strip():
            analyzer = CodeAnalyzer()
            
            with st.spinner("Analyzing your code..."):
                if language == "Python":
                    issues = analyzer.analyze_python_code(code_input)
                else:
                    issues = analyzer.analyze_javascript_code(code_input)
            
            # Filter issues based on user preferences
            filtered_issues = [
                issue for issue in issues
                if issue['severity'] in severity_filter and issue['type'] in issue_types
            ]
            
            if not filtered_issues:
                st.success("🎉 Great! No issues found with your current filter settings.")
                st.balloons()
            else:
                # Display summary
                st.subheader("📈 Summary")
                severity_counts = {}
                for issue in filtered_issues:
                    severity_counts[issue['severity']] = severity_counts.get(issue['severity'], 0) + 1
                
                col_high, col_med, col_low = st.columns(3)
                with col_high:
                    st.metric("High Severity", severity_counts.get('high', 0), delta_color="inverse")
                with col_med:
                    st.metric("Medium Severity", severity_counts.get('medium', 0), delta_color="inverse")
                with col_low:
                    st.metric("Low Severity", severity_counts.get('low', 0), delta_color="inverse")
                
                st.subheader("🔍 Detailed Issues")
                
                # Sort issues by line number and severity
                severity_order = {'high': 0, 'medium': 1, 'low': 2}
                filtered_issues.sort(key=lambda x: (x.get('line', 0), severity_order.get(x['severity'], 3)))
                
                for i, issue in enumerate(filtered_issues):
                    with st.expander(f"Line {issue.get('line', 'N/A')} - {issue['message']}", expanded=i < 3):
                        severity_color = {
                            'high': '🔴',
                            'medium': '🟡',
                            'low': '🟢'
                        }
                        
                        st.markdown(f"**{severity_color[issue['severity']]} Severity:** {issue['severity'].title()}")
                        st.markdown(f"**📍 Line:** {issue.get('line', 'N/A')}")
                        st.markdown(f"**🏷️ Type:** {issue['type'].title()}")
                        st.markdown(f"**💡 Suggestion:** {issue['suggestion']}")
        elif analyze_button:
            st.warning("⚠️ Please enter some code to analyze.")
    
    # Footer
    st.markdown("---")
    st.markdown("*Created by Claude (Sonnet 4) as an autonomous AI agent*")

if __name__ == "__main__":
    main()