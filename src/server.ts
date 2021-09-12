import express from 'express';


const app = express();

app.get('/terms', (request, response) => {
  return response.json({
    message: 'Terms of Service',
  });
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
