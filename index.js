const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://api.sambanova.ai/v1/chat/completions';
const API_KEY = '3b9b8db7-be77-418a-b0b4-abf57834941a';

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
