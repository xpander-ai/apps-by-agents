#!/usr/bin/env python3
"""
Google A2A Protocol Implementation - Agent Server
This module implements a simple A2A agent server with a 'greet' capability.
"""

import json
import http.server
import socketserver
from urllib.parse import parse_qs, urlparse

class A2AAgentHandler(http.server.BaseHTTPRequestHandler):
    """Handler for A2A agent server requests."""
    
    def _set_headers(self, content_type="application/json"):
        """Set the response headers."""
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight."""
        self._set_headers()
        
    def do_GET(self):
        """Handle GET requests."""
        parsed_url = urlparse(self.path)
        
        # Handle root path - return agent manifest
        if parsed_url.path == '/':
            self._set_headers()
            manifest = {
                "name": "Greeting Agent",
                "description": "A simple A2A agent that provides greeting capabilities",
                "version": "1.0.0",
                "capabilities": [
                    {
                        "name": "greet",
                        "description": "Generates a personalized greeting",
                        "inputs": {
                            "name": {
                                "type": "string",
                                "description": "Name of the person to greet",
                                "required": True
                            },
                            "language": {
                                "type": "string",
                                "description": "Language for the greeting (default: English)",
                                "required": False
                            }
                        },
                        "outputs": {
                            "greeting": {
                                "type": "string",
                                "description": "The personalized greeting"
                            }
                        }
                    }
                ]
            }
            self.wfile.write(json.dumps(manifest).encode())
        else:
            self._set_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
    
    def do_POST(self):
        """Handle POST requests."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            request = json.loads(post_data)
            
            # Handle capability invocation
            if self.path == '/invoke/greet':
                self._set_headers()
                
                # Extract parameters
                name = request.get('name', 'Friend')
                language = request.get('language', 'en')
                
                # Generate greeting based on language
                greeting = self._generate_greeting(name, language)
                
                response = {
                    "greeting": greeting
                }
                self.wfile.write(json.dumps(response).encode())
            else:
                self._set_headers()
                self.wfile.write(json.dumps({"error": "Unknown capability"}).encode())
                
        except json.JSONDecodeError:
            self._set_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
    
    def _generate_greeting(self, name, language):
        """Generate a greeting in the specified language."""
        greetings = {
            'en': f"Hello, {name}! Welcome to the A2A protocol.",
            'es': f"¡Hola, {name}! Bienvenido al protocolo A2A.",
            'fr': f"Bonjour, {name}! Bienvenue au protocole A2A.",
            'de': f"Hallo, {name}! Willkommen beim A2A-Protokoll.",
            'it': f"Ciao, {name}! Benvenuto al protocollo A2A.",
            'ja': f"こんにちは、{name}さん！A2Aプロトコルへようこそ。",
            'zh': f"你好，{name}！欢迎使用A2A协议。"
        }
        
        return greetings.get(language, greetings['en'])

def run_server(port=8000):
    """Run the A2A agent server."""
    server_address = ('', port)
    httpd = socketserver.TCPServer(server_address, A2AAgentHandler)
    print(f"Starting A2A agent server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()