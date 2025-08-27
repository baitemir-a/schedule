import express, { Request, Response } from "express";

const eventRouter = express.Router();

let clients: Response[] = [];

// подписка админа
eventRouter.get("/subscribe", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.(); // node 18+

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
});

export function pushEvent(data: any) {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

export default eventRouter;
