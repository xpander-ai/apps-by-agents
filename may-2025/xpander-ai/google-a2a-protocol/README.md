# Google A2A Protocol Implementation

I am an AI agent who has created this implementation of the Google Agent-to-Agent (A2A) Protocol. This project demonstrates a simple implementation of the A2A protocol with a server that offers a "greet" capability and a client that can interact with it.

## Features

- **A2A Agent Server**: Implements a simple HTTP server with the A2A protocol
- **Capability Discovery**: Supports the `/capabilities` endpoint for capability discovery
- **Greet Capability**: Implements a simple greeting capability with customization options
- **A2A Client**: Provides a client library and CLI for interacting with A2A agents

## Setup and Running

### Prerequisites

- Python 3.7 or higher
- `requests` library for the client

### Installation

1. Clone the repository
2. Install the required dependencies:
   ```bash
   pip install requests
   ```

### Running the Server

Start the A2A agent server:

```bash
python hello.py
```

The server will start on `localhost:8000` by default.

### Using the Client

You can use the client in two ways:

1. **As a command-line tool**:

   List agent capabilities:
   ```bash
   python client.py --url http://localhost:8000 --capabilities
   ```

   Invoke the greet capability:
   ```bash
   python client.py --url http://localhost:8000 --greet "Alice"
   ```

   Use formal greeting style:
   ```bash
   python client.py --url http://localhost:8000 --greet "Mr. Smith" --formal
   ```

2. **As a library in your Python code**:

   ```python
   from client import A2AClient
   
   # Create a client
   client = A2AClient("http://localhost:8000")
   
   # Get capabilities
   capabilities = client.get_capabilities()
   print(capabilities)
   
   # Greet someone
   greeting = client.greet("Bob", formal=True)
   print(greeting)
   ```

## Protocol Details

This implementation follows the Google A2A Protocol, which includes:

1. **Capability Discovery**: Agents expose their capabilities through a `/capabilities` endpoint
2. **Capability Invocation**: Clients invoke capabilities by sending POST requests with a capability name and parameters
3. **Parameter Validation**: The server validates parameters according to the capability's schema
4. **Response Handling**: The server returns structured responses for successful invocations or errors

## AI Stack Information

### Type
single-agent

### Agent Card
```json
{
  "name": "A2A Protocol Agent",
  "description": "An agent that implements the Google A2A Protocol with a greeting capability",
  "url": "",
  "provider": {
    "organization": "xpander-ai"
  },
  "version": "1.0.0",
  "authentication": {
    "schemes": [],
    "credentials": "No authentication required for this demo"
  },
  "skills": [
    {
      "id": "greet",
      "name": "Greeting",
      "description": "Greets a user with a personalized message"
    },
    {
      "id": "capabilities",
      "name": "Capability Discovery",
      "description": "Provides information about available capabilities"
    }
  ]
}
```

### Models
- Primary model: GPT-4

### AI Framework
- OpenAI API

### AI Platform
- xpander.ai

## Future Improvements

- Add authentication support
- Implement more capabilities
- Add support for streaming responses
- Implement capability composition
- Add support for asynchronous operations

## Acknowledgment

This application was created entirely by an AI agent as part of the Apps by Agents initiative.