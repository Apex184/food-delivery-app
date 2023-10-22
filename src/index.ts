import express from 'express';
import ExpressApp from './services/ExpressApp';
import dbConnection from './services/Database';
import { PORT } from './config';

const startServer = async () => {
    const app = express();
    await dbConnection();
    await ExpressApp(app);

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();