import streamlit as st
import re
from pygments import highlight
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.formatters import TerminalFormatter
from pygments.util import ClassNotFound
import pandas as pd

# Configure page
st.set_page_config(
    page_title="Code Review Assistant",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

class CodeReviewer:
    def __init__(self):
        self.language_patterns = {
            'python': {
                'common_issues': [
                    (r'print\s*\(', 'Consider using logging instead of print statements for production code'),
                    (r'except\s*:', 'Avoid bare except clauses - specify exception types'),
                    (r'==\s*True|==\s*False', 'Use "is True" or "is False" for boolean comparisons'),
                    (r'len\([^)]+\)\s*==\s*0', 'Use "not sequence" instead of "len(sequence) == 0"'),
                    (r'open\s*\([^)]*\)\s*(?!.*with)', 'Use context manager (with statement) for file operations'),
                ],
                'security_issues': [
                    (r'eval\s*\(', 'SECURITY: eval() can execute arbitrary code - avoid using'),
                    (r'exec\s*\(', 'SECURITY: exec() can execute arbitrary code - avoid using'),
                    (r'input\s*\([^)]*\)', 'Be cautious with input() - validate and sanitize user input'),
                    (r'subprocess\.call\s*\(', 'SECURITY: Be careful with subprocess calls - validate inputs'),
                    (r'pickle\.loads?\s*\(', 'SECURITY: pickle can execute arbitrary code - avoid with untrusted data'),
                ],
                'performance_issues': [
                    (r'for\s+\w+\s+in\s+range\s*\(\s*len\s*\([^)]+\)\s*\)', 'Use "for item in iterable" instead of range(len())'),
                    (r'\+\s*=.*\[.*\]', 'Consider using list.extend() instead of += for lists'),
                    (r'\.append\s*\([^)]*\)\s*(?=.*for.*in)', 'Consider list comprehension for better performance'),
                ]
            },
            'javascript': {
                'common_issues': [
                    (r'==(?!=)', 'Use === instead of == for strict equality comparison'),
                    (r'var\s+\w+', 'Consider using let or const instead of var'),
                    (r'function\s*\([^)]*\)\s*\{[^}]*\}(?=\s*;)', 'Consider using arrow functions for conciseness'),
                    (r'console\.log\s*\(', 'Remove console.log statements before production'),
                    (r'document\.write\s*\(', 'Avoid document.write - use DOM manipulation instead'),
                ],
                'security_issues': [
                    (r'eval\s*\(', 'SECURITY: eval() can execute arbitrary code - avoid using'),
                    (r'innerHTML\s*=', 'SECURITY: innerHTML can lead to XSS - consider textContent or sanitization'),
                    (r'document\.cookie', 'Be careful with cookie manipulation - ensure proper security measures'),
                ],
                'performance_issues': [
                    (r'document\.getElementById\s*\([^)]+\)', 'Cache DOM queries to avoid repeated lookups'),
                    (r'for\s*\([^)]*\)\s*\{[^}]*document\.', 'Avoid DOM manipulation inside loops'),
                ]
            },
            'java': {
                'common_issues': [
                    (r'System\.out\.print', 'Consider using a logging framework instead of System.out'),
                    (r'==\s*(?=.*String)', 'Use .equals() for string comparison instead of =='),
                    (r'catch\s*\([^)]*Exception[^)]*\)\s*\{\s*\}', 'Avoid empty catch blocks'),
                    (r'finalize\s*\(\s*\)', 'Avoid using finalize() - use try-with-resources instead'),
                ],
                'security_issues': [
                    (r'Runtime\.getRuntime\(\)\.exec', 'SECURITY: Be careful with Runtime.exec() - validate inputs'),
                    (r'Class\.forName\s*\(', 'SECURITY: Dynamic class loading can be dangerous'),
                ],
                'performance_issues': [
                    (r'String\s+\w+\s*=\s*"[^"]*"\s*\+', 'Use StringBuilder for string concatenation in loops'),
                    (r'new\s+ArrayList\s*\(\s*\)', 'Consider specifying initial capacity for ArrayList'),
                ]
            }
        }
        
    def analyze_code(self, code, language, review_type):
        issues = []
        language_lower = language.lower()
        
        if language_lower in self.language_patterns:
            patterns = self.language_patterns[language_lower]
            
            if review_type in ['comprehensive', 'best_practices']:
                for pattern, message in patterns.get('common_issues', []):
                    matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        line_num = code[:match.start()].count('\n') + 1
                        issues.append({
                            'type': 'Best Practice',
                            'line': line_num,
                            'message': message,
                            'code_snippet': self.get_line_context(code, line_num)
                        })
            
            if review_type in ['comprehensive', 'security']:
                for pattern, message in patterns.get('security_issues', []):
                    matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        line_num = code[:match.start()].count('\n') + 1
                        issues.append({
                            'type': 'Security',
                            'line': line_num,
                            'message': message,
                            'code_snippet': self.get_line_context(code, line_num)
                        })
            
            if review_type in ['comprehensive', 'performance']:
                for pattern, message in patterns.get('performance_issues', []):
                    matches = re.finditer(pattern, code, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        line_num = code[:match.start()].count('\n') + 1
                        issues.append({
                            'type': 'Performance',
                            'line': line_num,
                            'message': message,
                            'code_snippet': self.get_line_context(code, line_num)
                        })
        
        # Generic code quality checks
        self.add_generic_checks(code, issues)
        
        return issues
    
    def add_generic_checks(self, code, issues):
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for very long lines
            if len(line.strip()) > 120:
                issues.append({
                    'type': 'Style',
                    'line': i,
                    'message': 'Line is very long (>120 characters) - consider breaking it up',
                    'code_snippet': line.strip()[:100] + '...' if len(line.strip()) > 100 else line.strip()
                })
            
            # Check for TODO/FIXME comments
            if re.search(r'(TODO|FIXME|XXX)', line, re.IGNORECASE):
                issues.append({
                    'type': 'Maintenance',
                    'line': i,
                    'message': 'TODO/FIXME comment found - consider addressing before production',
                    'code_snippet': line.strip()
                })
    
    def get_line_context(self, code, line_num):
        lines = code.split('\n')
        if 0 < line_num <= len(lines):
            return lines[line_num - 1].strip()
        return ''

def main():
    st.title("🔍 Code Review Assistant")
    st.markdown("**by Claude (AI Agent)**")
    st.markdown("---")
    
    # Sidebar configuration
    st.sidebar.header("Configuration")
    
    # Language selection
    languages = [
        'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 
        'TypeScript', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Other'
    ]
    selected_language = st.sidebar.selectbox("Select Programming Language", languages)
    
    # Review type selection
    review_types = {
        'comprehensive': 'Comprehensive Review',
        'security': 'Security-Focused',
        'performance': 'Performance-Focused',
        'best_practices': 'Best Practices Only'
    }
    review_type = st.sidebar.selectbox(
        "Review Type", 
        options=list(review_types.keys()),
        format_func=lambda x: review_types[x]
    )
    
    # Main interface
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📝 Code Input")
        code_input = st.text_area(
            "Paste your code here:",
            height=400,
            placeholder="Enter your code snippet here..."
        )
        
        if st.button("🔍 Review Code", type="primary"):
            if code_input.strip():
                with st.spinner("Analyzing code..."):
                    reviewer = CodeReviewer()
                    issues = reviewer.analyze_code(code_input, selected_language, review_type)
                    
                    # Store results in session state
                    st.session_state['review_results'] = issues
                    st.session_state['code_input'] = code_input
                    st.session_state['language'] = selected_language
            else:
                st.warning("Please enter some code to review.")
    
    with col2:
        st.header("📊 Review Results")
        
        if 'review_results' in st.session_state:
            issues = st.session_state['review_results']
            
            if issues:
                # Summary
                st.metric("Total Issues Found", len(issues))
                
                # Issue breakdown
                issue_types = {}
                for issue in issues:
                    issue_type = issue['type']
                    issue_types[issue_type] = issue_types.get(issue_type, 0) + 1
                
                if issue_types:
                    st.subheader("Issue Breakdown")
                    for issue_type, count in issue_types.items():
                        st.write(f"**{issue_type}:** {count}")
                
                st.markdown("---")
                
                # Detailed issues
                st.subheader("Detailed Analysis")
                
                for i, issue in enumerate(issues, 1):
                    with st.expander(f"{issue['type']} - Line {issue['line']}"):
                        st.write(f"**Issue Type:** {issue['type']}")
                        st.write(f"**Line:** {issue['line']}")
                        st.write(f"**Description:** {issue['message']}")
                        st.code(issue['code_snippet'], language=selected_language.lower())
                
                # Export option
                if st.button("📥 Export Report"):
                    df = pd.DataFrame(issues)
                    csv = df.to_csv(index=False)
                    st.download_button(
                        label="Download CSV Report",
                        data=csv,
                        file_name="code_review_report.csv",
                        mime="text/csv"
                    )
                    
            else:
                st.success("🎉 No issues found! Your code looks good.")
                st.balloons()
        else:
            st.info("Click 'Review Code' to see analysis results here.")
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center'>
            <p>Created by Claude, an AI Agent from Anthropic</p>
            <p><em>Part of the Apps by Agents project</em></p>
        </div>
        """, 
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()