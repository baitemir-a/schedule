import { Request, Response } from "express";
import Journal from "../model/journal-model";
import { AuthenticatedRequest } from "../types/auth-types";
import { DateHelper } from "../helpers/date-helper";
import User from "../model/user-model";
import { pushEvent } from "../routes/event-router";
import { Op } from "sequelize";

interface NoteDto {
  note: string;
}

class JournalController {
  async getList(_: Request, res: Response): Promise<void> {
    try {
      const journals = await Journal.findAll({
        include: [{ model: User, as: "user" }],
      });
      res.status(200).json(journals);
    } catch (error) {
      res.status(500).json({ message: "Error finding journals", error });
    }
  }
  async clear(_: Request, res: Response): Promise<void> {
    try {
      Journal.destroy({ where: {} });
      res.status(200).json({ message: "Journals cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error clearing journals", error });
    }
  }
  async getById(
    req: Request<{ uuid: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    const { uuid } = req.params;
    try {
      const journal = await Journal.findByPk(uuid, {
        include: [{ model: User, as: "user" }],
      });
      if (journal) {
        res.status(200).json(journal);
      } else {
        res.status(404).json({ message: "Journal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding journal", error });
    }
  }
  async getByUserId(
    req: Request<{ uuid: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    const { uuid } = req.params;
    try {
      const journal = await Journal.findOne({
        where: { user_id: uuid },
        include: [{ model: User, as: "user" }],
      });
      if (journal) {
        res.status(200).json(journal);
      } else {
        res.status(404).json({ message: "Journal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding journal", error });
    }
  }

  async note(
    req: Request<{ uuid: string }, {}, NoteDto>,
    res: Response
  ): Promise<void> {
    const { uuid } = req.params;
    const { note } = req.body;
    try {
      const journal = await Journal.findByPk(uuid, {
        include: [{ model: User, as: "user" }],
      });
      if (journal) {
        const updatedJournal = await journal.update({ note: note });
        res.status(200).json(updatedJournal);
      } else {
        res.status(404).json({ message: "Journal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding journal", error });
    }
  }

  async first(
    req: AuthenticatedRequest<{ date: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    const { date } = req.params;

    if (!DateHelper.isToday(date)) {
      res.status(400).json({ message: "Error, QR code is expired or invalid" });
      return;
    }

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const existing = await Journal.findOne({
        where: {
          user_id: req.user?.uuid,
          date: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      console.log();

      if (existing && !existing.arrival_time) {
        res.status(400).json({ message: "Can not scan twice" });
        return;
      }

      if (!existing) {
        const newJournal = await Journal.create({
          user_id: req.user?.uuid,
          date: new Date(),
        });

        pushEvent({
          type: "NEW_JOURNAL",
          payload: { uuid: newJournal.uuid, user: req.user },
        });
      } else {
        pushEvent({
          type: "NEW_JOURNAL",
          payload: { uuid: existing.uuid, user: req.user },
        });
      }

      res.status(201).json({ message: "Journal successfully created" });
    } catch (error) {
      res.status(500).json({ message: "Error creating QR", error });
    }
  }

  async second(
    req: AuthenticatedRequest<{ uuid: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    try {
      const { uuid } = req.params;

      const journal = await Journal.findByPk(uuid, {
        include: [{ model: User, as: "user" }],
      });

      if (!journal) {
        console.log(uuid);
        res.status(404).json({ message: "Journal not found" });
        return;
      }

      if (journal.user.uuid !== req.user?.uuid) {
        res
          .status(400)
          .json({ message: "Error, QR code is expired or invalid" });
        return;
      }

      const now = new Date();
      const currentTime = now.toTimeString().split(" ")[0]; // HH:mm:ss

      if (!journal.arrival_time) {
        const status =
          currentTime > DateHelper.ARRIVAL_TIME ? "LATE" : "ONTIME";
        await journal.update({
          arrival_time: currentTime,
          status,
        });

        res.status(200).json({
          message: "arrival marked",
          data: {
            uuid: journal.uuid,
            arrival_time: journal.arrival_time,
            status: journal.status,
          },
        });
      } else {
        const arrival = new Date(`1970-01-01T${journal.arrival_time}Z`);
        const departure = new Date(`1970-01-01T${currentTime}Z`);

        const diffMs = departure.getTime() - arrival.getTime();
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        const totalTime = [hours, minutes, seconds]
          .map((x) => String(x).padStart(2, "0"))
          .join(":");

        await journal.update({
          departure_time: currentTime,
          total_time: totalTime,
        });

        res.status(200).json({
          message: "departure marked",
          data: {
            uuid: journal.uuid,
            departure_time: journal.departure_time,
            total_time: journal.total_time,
          },
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error marking journal", error });
    }
  }
}

export default new JournalController();
