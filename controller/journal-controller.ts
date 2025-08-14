import { Request, Response } from 'express';
import dotenv from 'dotenv';
import Journal from '../model/journal-model';
import { AuthenticatedRequest } from '../types/auth-types';
import { DateHelper } from '../helpers/date-helper';


dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'your_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_secret_key';


class JournalController {

    async first(req: AuthenticatedRequest<{ date: string }, {}, {}>, res: Response): Promise<void> {
        const { date } = req.params;

        if (!DateHelper.isToday(date)) {
            console.log(date);
            
            res.status(400).json({ message: 'Error, QR code is expired or invalid' });
            return
        }

        try {
            const newJournal = await Journal.create({
                user_id: req.user?.uuid,
                date: new Date()
            });

            res.status(201).json({ uuid: newJournal.uuid });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

}

export default new JournalController();
