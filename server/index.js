const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

// Add a root route for GET requests
app.get('/', (req, res) => {
  res.send('Welcome to the Keyword Research API! Use POST /api/keywords to fetch keywords.');
});

app.post('/api/keywords', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'user',
            content: `Generate a list of 50 SEO keywords related to "${query}" with search volume (100-10000), difficulty (0-100), CPC in USD (0.00-20.00), intent (I for Informational, C for Commercial, N for Navigational), and SF (1-10). Format as JSON array.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const keywords = JSON.parse(response.data.choices[0].message.content);
    res.json(keywords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
