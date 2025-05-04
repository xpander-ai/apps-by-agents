#!/usr/bin/env python3
"""
Google A2A Protocol Server Implementation
This module implements a simple A2A agent server with a 'greet' capability.
"""

import json
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define the agent's capabilities
AGENT_CAPABILITIES = {
    "greet": {
        "description": "Greets a user with a personalized message",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "The name of the person to greet"
                },
                "formal": {
                    "type": "boolean",
                    "description": "Whether to use formal greeting style",
                    "default": False
                }
            },
            "required": ["name"]
        }
    }
}

class A2ARequestHandler(BaseHTTPRequestHandler):
    """Handler for A2A protocol requests"""
    
    def _set_headers(self, status_code: int = 200):
        """Set the HTTP response headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
    
    def _send_json_response(self, data: Dict[str, Any], status_code: int = 200):
        """Send a JSON response with the given data and status code"""
        self._set_headers(status_code)
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _handle_capabilities_request(self):
        """Handle a request for the agent's capabilities"""
        response = {
            "capabilities": AGENT_CAPABILITIES
        }
        self._send_json_response(response)
        logger.info("Capabilities request handled successfully")
    
    def _handle_greet_request(self, params: Dict[str, Any]):
        """Handle a greet capability request"""
        name = params.get("name", "")
        formal = params.get("formal", False)
        
        if not name:
            self._send_json_response(
                {"error": "Missing required parameter: name"}, 
                400
            )
            return
        
        if formal:
            greeting = f"Good day, {name}. It's a pleasure to make your acquaintance."
        else:
            greeting = f"Hey {name}! Great to meet you!"
        
        response = {
            "greeting": greeting
        }
        self._send_json_response(response)
        logger.info(f"Greeted user: {name} (formal: {formal})")
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == "/capabilities":
            self._handle_capabilities_request()
        else:
            self._send_json_response(
                {"error": "Not found"}, 
                404
            )
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self._send_json_response(
                {"error": "Empty request body"}, 
                400
            )
            return
        
        try:
            request_data = json.loads(self.rfile.read(content_length).decode('utf-8'))
            capability = request_data.get("capability")
            params = request_data.get("parameters", {})
            
            if not capability:
                self._send_json_response(
                    {"error": "Missing capability in request"}, 
                    400
                )
                return
            
            if capability == "greet":
                self._handle_greet_request(params)
            else:
                self._send_json_response(
                    {"error": f"Unsupported capability: {capability}"}, 
                    400
                )
        except json.JSONDecodeError:
            self._send_json_response(
                {"error": "Invalid JSON in request body"}, 
                400
            )
        except Exception as e:
            logger.error(f"Error handling request: {str(e)}")
            self._send_json_response(
                {"error": "Internal server error"}, 
                500
            )

def run_server(host: str = "localhost", port: int = 8000):
    """Run the A2A agent server"""
    server_address = (host, port)
    httpd = HTTPServer(server_address, A2ARequestHandler)
    logger.info(f"Starting A2A agent server on {host}:{port}")
    logger.info(f"Available capabilities: {list(AGENT_CAPABILITIES.keys())}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    finally:
        httpd.server_close()
        logger.info("Server closed")

if __name__ == "__main__":
    run_server()