import { Context } from "probot" // eslint-disable-line @typescript-eslint/no-unused-vars
import { CheckRunRerequestedEvent } from "@octokit/webhooks-types"
import Runs from "../models/runs.model"

async function handleReRun(context: Context): Promise<void> {
  const payload: CheckRunRerequestedEvent = context?.payload as CheckRunRerequestedEvent;
  if (!payload?.check_run?.id) return

  const run = await Runs.findOne({ "checks.checks_run_id": { $in: payload.check_run.id }})

  if (!run) return
  const check = run.checks.find((check) => check.checks_run_id === payload.check_run.id )
  if (!check) return;

  await context.octokit.actions.reRunWorkflow({
    owner: run.repository.owner,
    repo: run.config.workflows_repository,
    run_id: check.run_id || 0
  })
}

export default handleReRun; 