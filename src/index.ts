import { Probot } from "probot"
import { Request, Response } from "express";
import dbConnect from "./db-connect";

import handlePush from "./handlers/push"
import handleCompletedRun from "./handlers/completed-run"
import handleReRun from "./handlers/re-run"
import handleRegister from "./handlers/register"
import { app_route } from "./constants";

export default async (app: Probot, { getRouter }: { getRouter: any }) => {
  const { dbStatus } = await dbConnect();
  app.log.info("app started")

  const router = getRouter(app_route)

  app.on("push", handlePush);
  app.on("workflow_run.completed", handleCompletedRun);
  app.on("check_run.rerequested", handleReRun);

  router.get("/register", (req: Request, res: Response) => handleRegister(req, res, { app }))
  router.get("/health", (_: Request, res: Response) => {
    const { connection, dbState } = dbStatus();
    const status = connection === "up" && dbState === "connected" ? 200 : 503
    res.status(status).json({
      ...dbStatus(),
      sha: process.env.SHA_REF || "unknown"
    })
  })
}
