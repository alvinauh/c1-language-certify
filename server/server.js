
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Restrict to your frontend URL in production
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('OpenAI Proxy API is running');
});

// OpenAI proxy endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt, model, max_tokens, temperature } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Call OpenAI API
    const completion = await openai.completions.create({
      model: model || 'gpt-4o-mini',
      prompt,
      max_tokens: max_tokens || 1000,
      temperature: temperature || 0.7,
    });
    
    res.json({
      completion: completion.choices[0].text.trim(),
      usage: completion.usage,
    });
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while generating content' 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
