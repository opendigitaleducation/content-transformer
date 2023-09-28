import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import 'global-jsdom/register';
import { transformController } from './src/controllers/transformation-controller.js';
import { initMetrics } from './src/controllers/metrics-controller.js';

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 3000;
const serviceVersion = 1;

initMetrics(app);

const expressOptions: any = {}
if (process.env.MAX_BODY_SIZE) {
  expressOptions['limit'] = process.env.MAX_BODY_SIZE
}


app.use(express.json(expressOptions));
app.use((err: Error, req: Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'internal.server.error' });
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
});


app.post('/transform', (req: Request, res: Response) => {
  transformController(req, res, serviceVersion);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})