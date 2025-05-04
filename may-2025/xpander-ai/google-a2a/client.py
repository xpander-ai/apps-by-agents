#!/usr/bin/env python3
"""
Google A2A Protocol Implementation - Client
This module implements a client to interact with the A2A agent server.
"""

import json
import requests
import argparse

class A2AClient:
    """Client for interacting with A2A agents."""
    
    def __init__(self, agent_url):
        """Initialize the A2A client with the agent URL."""
        self.agent_url = agent_url.rstrip('/')
        self.capabilities = {}
        self._fetch_manifest()
    
    def _fetch_manifest(self):
        """Fetch the agent manifest to discover capabilities."""
        try:
            response = requests.get(self.agent_url)
            response.raise_for_status()
            
            manifest = response.json()
            print(f"Connected to agent: {manifest.get('name', 'Unknown')}")
            print(f"Description: {manifest.get('description', 'No description')}")
            print(f"Version: {manifest.get('version', 'Unknown')}")
            
            # Store capabilities
            for capability in manifest.get('capabilities', []):
                self.capabilities[capability['name']] = {
                    'description': capability.get('description', ''),
                    'inputs': capability.get('inputs', {}),
                    'outputs': capability.get('outputs', {})
                }
            
            print(f"Available capabilities: {', '.join(self.capabilities.keys())}")
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching agent manifest: {e}")
            exit(1)
    
    def list_capabilities(self):
        """List all available capabilities with their descriptions."""
        print("\nAvailable Capabilities:")
        for name, details in self.capabilities.items():
            print(f"- {name}: {details['description']}")
            
            if details['inputs']:
                print("  Inputs:")
                for input_name, input_details in details['inputs'].items():
                    required = " (required)" if input_details.get('required', False) else ""
                    print(f"    - {input_name}: {input_details.get('description', '')}{required}")
            
            if details['outputs']:
                print("  Outputs:")
                for output_name, output_details in details['outputs'].items():
                    print(f"    - {output_name}: {output_details.get('description', '')}")
            print()
    
    def invoke_capability(self, capability_name, **params):
        """Invoke a capability on the agent with the provided parameters."""
        if capability_name not in self.capabilities:
            print(f"Error: Capability '{capability_name}' not found.")
            return None
        
        # Check for required parameters
        for input_name, input_details in self.capabilities[capability_name]['inputs'].items():
            if input_details.get('required', False) and input_name not in params:
                print(f"Error: Required parameter '{input_name}' is missing.")
                return None
        
        try:
            response = requests.post(
                f"{self.agent_url}/invoke/{capability_name}",
                json=params
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error invoking capability: {e}")
            return None

def main():
    """Main function to run the client."""
    parser = argparse.ArgumentParser(description='A2A Protocol Client')
    parser.add_argument('--url', default='http://localhost:8000', help='URL of the A2A agent server')
    parser.add_argument('--list', action='store_true', help='List available capabilities')
    parser.add_argument('--greet', action='store_true', help='Invoke the greet capability')
    parser.add_argument('--name', help='Name parameter for greeting')
    parser.add_argument('--language', default='en', help='Language for greeting (default: en)')
    
    args = parser.parse_args()
    
    client = A2AClient(args.url)
    
    if args.list:
        client.list_capabilities()
    
    if args.greet:
        if not args.name:
            args.name = input("Enter name for greeting: ")
        
        result = client.invoke_capability('greet', name=args.name, language=args.language)
        if result:
            print(f"\nGreeting: {result.get('greeting', 'No greeting returned')}")

if __name__ == "__main__":
    main()