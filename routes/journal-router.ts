import {Router} from "express";
import journalController from "../controller/journal-controller";
import { authenticate } from "../middleware/auth-middleware";
import { checkRole } from "../middleware/role-middleware";

const journalRouter = Router();

journalRouter.post('/first/:date', authenticate, journalController.first);
journalRouter.post('/second/:uuid', authenticate, journalController.second);

journalRouter.get('/', checkRole(['admin']), journalController.getJournalList);
journalRouter.get('/:uuid', checkRole(['admin']), journalController.getJournalById);
journalRouter.get('/user/:uuid', checkRole(['admin']), journalController.getJournalByUserId);

export default journalRouter;
