import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from '../db';
import userRouter from './routes/user-router';
import authRouter from "./routes/auth-router";
import journalRouter from './routes/journal-router';
import cookies from 'cookie-parser'
import path from 'path';
import User from './model/user-model';
import dotenv from 'dotenv';

const index: Application = express();
const port = 5000;

dotenv.config();

User.findOrCreate({
    where: { email: 'super@user.com' }, defaults: {
        name: process.env.SUPERUSER_NAME,
        email: process.env.SUPERUSER_EMAIL,
        password: process.env.SUPERUSER_PASSWORD,
        role: 'admin'
    }
})

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});

index.use(cors({
    credentials: true,
    origin: "*"
}));



index.use('/uploads', express.static(path.join(__dirname, 'uploads')));

index.use(cookies())
index.use(bodyParser.urlencoded({ extended: false }));
index.use(bodyParser.json());

index.use("/ping", (req, res) => res.status(200).json({ message: 'ok' }));
index.use("/users", userRouter);
index.use("/auth", authRouter);
index.use("/journal", journalRouter);

index.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
