import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './db';
import userRouter from './routes/user-router';
import authRouter from "./routes/auth-router";
import cookies from 'cookie-parser'
import path from 'path';
import User from './model/user-model';
import dotenv from 'dotenv';

const app: Application = express();
const port = 5000;

dotenv.config();

User.findOrCreate({where:{email:'super@user.com'}, defaults:{
    name: process.env.SUPERUSER_NAME,
    email: process.env.SUPERUSER_EMAIL,
    password: process.env.SUPERUSER_PASSWORD,
    role:'admin'
}})

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err: Error) => {
    console.error('Error syncing database:', err);
});

app.use(cors({
    credentials: true,
    origin: "*"
}));



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookies())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
