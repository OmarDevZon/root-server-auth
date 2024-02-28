// import { Server } from 'http';
// import mongoose from 'mongoose';
// import app from './app';
// import seedSuperAdmin from './app/DB';
// import config from './app/config';

// let server: Server;

// async function main() {
//   try {
//     await mongoose.connect(config.database_url as string);

//     seedSuperAdmin();
//     server = app.listen(config.port, () => {
//       console.log(`app is listening on port ${config.port}`);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

// main();

// process.on('unhandledRejection', (err) => {
//   console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { databaseConnecting } from './app/config/database.config';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors()); //added any url
app.use(cors({ origin: ['http://localhost:5173'], credentials: true })); // added fixed url

databaseConnecting();

app.listen(config.port, () => {
  console.log(`live            :👉 http://localhost:${config.port}/`);
});

const startServer = (req: Request, res: Response) => {
  try {
    res.send(`${config.welcome_message}`);
  } catch (error) {
    console.log('server         :😈 server not start');
  }
};

process.on('uncaughtException', () => {
  console.log(
    `server         : 😈 uncaughtException is detected , shutting down ...`,
  );
  process.exit(1);
});

app.use('/api/v1', router);


app.get('/', startServer);
app.use(globalErrorHandler);
//Not Found
app.use(notFound);
