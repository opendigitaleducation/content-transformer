import { contentType } from './node_modules/prom-client/index.d';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import 'global-jsdom/register';
import { transformController } from './src/controllers/transformation-controller.js';
import prom from 'prom-client';
import { ContentTransformerRequest } from './src/models/transformation-request.js';
import { TransformationFormat } from './src/models/format.js';

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 3000;
const serviceVersion = 1;

initMetrics(app);

const h2jCounter = new prom.Counter({
  name: 'html_2_json_total',
  help: 'The number of transformations from html to JSON'
});
const j2hCounter = new prom.Counter({
  name: 'json_html_2_total',
  help: 'The number of transformations from JSON to html'
});
const h2jTimer = new prom.Histogram ({
  name: 'html_2_json_time',
  help: 'HTML to JSON transformation time',
});
const j2hTimer = new prom.Histogram ({
  name: 'json_2_html_time',
  help: 'JSON to HTML transformation time',
});

app.use(express.json());
app.use((err: Error, req: Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'internal.server.error' });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});


app.post('/transform', (req: Request, res: Response) => {
  const data: ContentTransformerRequest = req.body as ContentTransformerRequest;
  const start = Date.now();
  transformController(req, res, serviceVersion).then(() => {
    const elapsed = Date.now() - start;
    if (data.htmlContent != null) {
      h2jCounter.inc();
      h2jTimer.observe(elapsed);
    } else if (data.jsonContent != null) {
      j2hCounter.inc();
      j2hTimer.observe(elapsed);      
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


function initMetrics(app: Express) {
  const collectDefaultMetrics = prom.collectDefaultMetrics;
  collectDefaultMetrics({ 'prefix': 'html_json_'});  
  app.get('/metrics', (req: Request, res: Response) => {
    res.set('Content-Type', prom.register.contentType);
    prom.register.metrics().then(data => {
      res.end(data);
    });
  });
}