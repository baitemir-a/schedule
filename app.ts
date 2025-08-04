import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './db';
import userRouter from './routes/user-router';

const app: Application = express();
const port = 5000;

// Sync database
sequelize.sync({force:true}).then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});

// Middleware
app.use(cors({
    credentials: true,
    origin: "*"
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/users", userRouter);

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
