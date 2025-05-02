
# OpenAI Proxy Server

This is a secure proxy server for handling OpenAI API calls. It keeps your API key safe on the server side instead of exposing it in client-side code.

## Setup

1. Clone this repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```
4. Add your OpenAI API key to the `.env` file
5. Start the server
   ```
   npm start
   ```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your repository
3. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CLIENT_URL`: URL of your frontend application
5. Deploy the service

## API Endpoints

### POST /api/openai

Proxies requests to OpenAI's API.

**Request Body:**

```json
{
  "prompt": "Your prompt text here",
  "model": "gpt-4o-mini",     // Optional
  "max_tokens": 1000,         // Optional
  "temperature": 0.7          // Optional
}
```

**Response:**

```json
{
  "completion": "Generated text response",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```
