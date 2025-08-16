import {Router} from "express";
import journalController from "../controller/journal-controller";
import { authenticate } from "../middleware/auth-middleware";

const journalRouter = Router();

journalRouter.post('/first/:date', authenticate, journalController.first);
journalRouter.post('/second/:uuid', authenticate, journalController.second);

export default journalRouter;
