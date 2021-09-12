import express from 'express';

import { router } from './routes';

const app = express();

app.get('/terms', (request, response) => {
  return response.json({
    message: 'Terms of Service',
  });
});

app.use('/v1', router);
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
