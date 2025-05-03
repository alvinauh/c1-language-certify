
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// OpenAI proxy endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt, model = 'gpt-4o-mini', max_tokens = 1000, temperature = 0.7 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Call OpenAI API
    const completion = await openai.completions.create({
      model,
      prompt,
      max_tokens,
      temperature,
    });
    
    // Return the response
    res.status(200).json({
      completion: completion.choices[0].text,
      usage: completion.usage
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while calling OpenAI API' 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
