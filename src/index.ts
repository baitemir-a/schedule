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
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import eventRouter from './routes/event-router';

const app: Application = express();
const port = 5000;

dotenv.config();

// === Swagger setup ===
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "Express API with Swagger",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ["./routes/*.ts"], // <-- look into your routers
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// === end Swagger setup ===

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

app.use(cors({
    credentials: true,
<<<<<<< HEAD:app.ts
    origin: ["http://localhost:5173", process.env.FRONTEND_URL || ""]
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
    origin: ["http://localhost:5173", process.env.FRONTEND_URL||""]
}));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
>>>>>>> aef81e3016893d8c22624bf0a46d1e8fdb3f4b8d:src/index.ts
app.use(cookies())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/events", eventRouter);
app.use("/ping", (_, res) => res.status(200).json({ message: 'ok' }));
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/journal", journalRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});