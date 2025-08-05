import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './db';
import userRouter from './routes/user-router';
import authRouter from "./routes/auth-router";
import cookies from 'cookie-parser'
const app: Application = express();
const port = 5000;

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});

app.use(cors({
    credentials: true,
    origin: "*"
}));

app.use(cookies())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
