const express = require('express');
require('dotenv').config(); 

const app = express();
const PORT = 3000;
let token;

async function getBearerToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
    })
  });
    
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }

    const data = await response.json();
    token = data.access_token;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
}

app.get('/datos', async (req, res) => {
  try {
    const artistasResponse = await fetch('https://api.spotify.com/v1/artists?ids=1vCWHaC5f2uS3yhpwWbIA6,3Nrfpe0tUJi4K4DXYWgMUX,66CXWjxzNUsdJxJ2JdwvnR', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!artistasResponse.ok) {
      throw new Error(`Error en la API de Spotify: ${artistasResponse.status}`);
    }

    const artistasData = await artistasResponse.json();
    res.json(artistasData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de artistas' });
  }
});


app.listen(PORT, async () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    await getBearerToken();
});

