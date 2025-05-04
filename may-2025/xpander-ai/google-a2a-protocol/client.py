#!/usr/bin/env python3
"""
Google A2A Protocol Client Implementation
This module implements a client to interact with an A2A agent server.
"""

import json
import argparse
import requests
from typing import Dict, Any, Optional

class A2AClient:
    """Client for interacting with A2A protocol agents"""
    
    def __init__(self, base_url: str):
        """
        Initialize the A2A client
        
        Args:
            base_url: The base URL of the A2A agent server
        """
        self.base_url = base_url.rstrip('/')
        self.capabilities = None
    
    def get_capabilities(self) -> Dict[str, Any]:
        """
        Fetch the agent's capabilities
        
        Returns:
            Dictionary of capabilities
        """
        response = requests.get(f"{self.base_url}/capabilities")
        response.raise_for_status()
        data = response.json()
        self.capabilities = data.get("capabilities", {})
        return self.capabilities
    
    def invoke_capability(self, capability: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invoke a capability on the agent
        
        Args:
            capability: The name of the capability to invoke
            parameters: Parameters to pass to the capability
            
        Returns:
            The response from the agent
        """
        if self.capabilities is None:
            self.get_capabilities()
        
        if capability not in self.capabilities:
            raise ValueError(f"Capability '{capability}' not supported by this agent")
        
        request_data = {
            "capability": capability,
            "parameters": parameters
        }
        
        response = requests.post(
            self.base_url,
            json=request_data
        )
        response.raise_for_status()
        return response.json()
    
    def greet(self, name: str, formal: bool = False) -> str:
        """
        Invoke the 'greet' capability
        
        Args:
            name: The name of the person to greet
            formal: Whether to use formal greeting style
            
        Returns:
            The greeting message
        """
        response = self.invoke_capability("greet", {
            "name": name,
            "formal": formal
        })
        return response.get("greeting", "")

def main():
    """Main function to run the client from command line"""
    parser = argparse.ArgumentParser(description="A2A Protocol Client")
    parser.add_argument("--url", default="http://localhost:8000", help="A2A agent server URL")
    parser.add_argument("--capabilities", action="store_true", help="List agent capabilities")
    parser.add_argument("--greet", metavar="NAME", help="Greet a person")
    parser.add_argument("--formal", action="store_true", help="Use formal greeting style")
    
    args = parser.parse_args()
    client = A2AClient(args.url)
    
    try:
        if args.capabilities:
            capabilities = client.get_capabilities()
            print("Agent capabilities:")
            for name, details in capabilities.items():
                print(f"- {name}: {details['description']}")
        
        elif args.greet:
            greeting = client.greet(args.greet, args.formal)
            print(greeting)
        
        else:
            parser.print_help()
    
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to A2A agent at {args.url}")
    except requests.exceptions.HTTPError as e:
        print(f"Error: HTTP request failed: {e}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()