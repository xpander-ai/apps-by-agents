import streamlit as st
import re
import ast
from typing import List, Dict, Any

class CodeReviewAssistant:
    def __init__(self):
        self.best_practices = {
            'python': {
                'naming': [
                    ('snake_case_functions', r'^[a-z][a-z0-9_]*$', 'Function names should use snake_case'),
                    ('snake_case_variables', r'^[a-z][a-z0-9_]*$', 'Variable names should use snake_case'),
                    ('pascal_case_classes', r'^[A-Z][a-zA-Z0-9]*$', 'Class names should use PascalCase'),
                    ('constant_uppercase', r'^[A-Z][A-Z0-9_]*$', 'Constants should be UPPERCASE'),
                ],
                'structure': [
                    ('docstrings', r'""".*?"""', 'Functions should have docstrings'),
                    ('import_order', r'^(import|from)', 'Imports should be at the top'),
                    ('line_length', r'.{80,}', 'Lines should be under 80 characters'),
                ],
                'security': [
                    ('sql_injection', r'(execute|query).*%', 'Potential SQL injection vulnerability'),
                    ('hardcoded_secrets', r'(password|secret|key|token)\s*=\s*["\']', 'Avoid hardcoded secrets'),
                    ('eval_usage', r'\beval\(', 'Avoid using eval() - security risk'),
                ],
            },
            'javascript': {
                'naming': [
                    ('camel_case', r'^[a-z][a-zA-Z0-9]*$', 'Variables should use camelCase'),
                    ('pascal_case_classes', r'^[A-Z][a-zA-Z0-9]*$', 'Class names should use PascalCase'),
                ],
                'structure': [
                    ('semicolons', r';$', 'Statements should end with semicolons'),
                    ('strict_mode', r'"use strict"', 'Use strict mode'),
                ],
                'security': [
                    ('eval_usage', r'\beval\(', 'Avoid using eval() - security risk'),
                    ('innerhtml', r'\.innerHTML\s*=', 'Avoid innerHTML for user input - XSS risk'),
                ],
            }
        }

    def detect_language(self, code: str) -> str:
        """Detect the programming language of the code snippet."""
        if re.search(r'\bdef\s+\w+\(', code) or re.search(r'\bimport\s+\w+', code):
            return 'python'
        elif re.search(r'\bfunction\s+\w+\(', code) or re.search(r'\bconst\s+\w+\s*=', code):
            return 'javascript'
        return 'unknown'

    def analyze_code(self, code: str, language: str = None) -> List[Dict[str, Any]]:
        """Analyze code for best practice violations."""
        if language is None:
            language = self.detect_language(code)
        
        if language not in self.best_practices:
            return [{'type': 'info', 'message': f'Language {language} not supported yet'}]
        
        issues = []
        practices = self.best_practices[language]
        
        lines = code.split('\n')
        
        for category, rules in practices.items():
            for rule_name, pattern, message in rules:
                for line_num, line in enumerate(lines, 1):
                    if re.search(pattern, line):
                        severity = self._get_severity(category)
                        issues.append({
                            'type': severity,
                            'line': line_num,
                            'rule': rule_name,
                            'message': message,
                            'code_line': line.strip()
                        })
        
        return self._add_general_feedback(code, language, issues)

    def _get_severity(self, category: str) -> str:
        """Get severity level based on category."""
        severity_map = {
            'security': 'error',
            'structure': 'warning',
            'naming': 'info'
        }
        return severity_map.get(category, 'info')

    def _add_general_feedback(self, code: str, language: str, issues: List[Dict]) -> List[Dict]:
        """Add general feedback about code quality."""
        lines = code.split('\n')
        
        # Check for basic code structure
        if language == 'python':
            if not any('def ' in line for line in lines) and not any('class ' in line for line in lines):
                issues.append({
                    'type': 'info',
                    'message': 'Consider organizing code into functions or classes',
                    'rule': 'code_organization'
                })
        
        # Check for comments
        comment_count = sum(1 for line in lines if line.strip().startswith('#') or line.strip().startswith('//'))
        if len(lines) > 10 and comment_count == 0:
            issues.append({
                'type': 'info',
                'message': 'Consider adding comments to explain complex logic',
                'rule': 'comments'
            })
        
        return issues

def main():
    st.set_page_config(
        page_title="Code Review Assistant",
        page_icon="🔍",
        layout="wide"
    )
    
    st.title("🔍 Code Review Assistant")
    st.markdown("Upload your code snippets and get instant feedback on best practices!")
    
    # Initialize the code review assistant
    reviewer = CodeReviewAssistant()
    
    # Sidebar with language selection
    st.sidebar.header("Settings")
    language_options = ['Auto-detect', 'Python', 'JavaScript']
    selected_language = st.sidebar.selectbox("Programming Language", language_options)
    
    # Main code input area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("📝 Code Input")
        code_input = st.text_area(
            "Paste your code here:",
            height=400,
            placeholder="def hello_world():\n    print('Hello, World!')"
        )
        
        if st.button("🔍 Review Code", type="primary"):
            if code_input.strip():
                # Determine language
                lang = None if selected_language == 'Auto-detect' else selected_language.lower()
                
                # Analyze the code
                issues = reviewer.analyze_code(code_input, lang)
                
                # Store results in session state
                st.session_state.review_results = issues
                st.session_state.code_input = code_input
            else:
                st.warning("Please enter some code to review!")
    
    with col2:
        st.subheader("📊 Review Results")
        
        if hasattr(st.session_state, 'review_results') and st.session_state.review_results:
            issues = st.session_state.review_results
            
            # Summary statistics
            error_count = sum(1 for issue in issues if issue.get('type') == 'error')
            warning_count = sum(1 for issue in issues if issue.get('type') == 'warning')
            info_count = sum(1 for issue in issues if issue.get('type') == 'info')
            
            # Display summary
            col_a, col_b, col_c = st.columns(3)
            with col_a:
                st.metric("🚨 Errors", error_count)
            with col_b:
                st.metric("⚠️ Warnings", warning_count)
            with col_c:
                st.metric("ℹ️ Info", info_count)
            
            # Display detailed issues
            st.markdown("---")
            
            if not issues or all(issue.get('type') == 'info' and issue.get('rule') == 'no_issues' for issue in issues):
                st.success("✅ Great! No major issues found in your code!")
            else:
                for i, issue in enumerate(issues):
                    icon = {"error": "🚨", "warning": "⚠️", "info": "ℹ️"}.get(issue['type'], "ℹ️")
                    
                    with st.expander(f"{icon} {issue.get('rule', 'General').replace('_', ' ').title()}"):
                        st.write(f"**Message:** {issue['message']}")
                        if 'line' in issue:
                            st.write(f"**Line {issue['line']}:** `{issue.get('code_line', '')}`")
                        
                        # Add suggestions based on the rule
                        if issue.get('rule') == 'snake_case_functions':
                            st.info("💡 **Tip:** Use lowercase with underscores: `my_function()`")
                        elif issue.get('rule') == 'hardcoded_secrets':
                            st.error("🔐 **Security:** Use environment variables for secrets!")
                        elif issue.get('rule') == 'eval_usage':
                            st.error("🛡️ **Security:** Consider safer alternatives like `ast.literal_eval()`")
        else:
            st.info("👆 Enter some code above and click 'Review Code' to get started!")
    
    # Footer with tips
    st.markdown("---")
    st.markdown("""
    ### 💡 Quick Tips for Better Code:
    - **Security First**: Never hardcode passwords or use `eval()`
    - **Naming Conventions**: Use consistent naming (snake_case for Python, camelCase for JavaScript)
    - **Documentation**: Add docstrings and comments to explain your code
    - **Structure**: Organize code into functions and classes
    - **Testing**: Always test your code before deployment
    """)

if __name__ == "__main__":
    main()