require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

//swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const postmanToOpenApi = require('postman-to-openapi')
const swaggerJson = require('./openapi.json')

//connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
//routers
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.use(helmet()); // set security headers
app.use(cors()); // allow requests from other domains
app.use(xss()); // prevent xss attacks
// rate limit
app.set('trust proxy', 1); // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc) 
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
}
);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser ,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
