import { Context } from "probot" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WorkflowRunCompletedEvent } from "@octokit/webhooks-types"
import Runs from "../models/runs.model"
 
async function handleCompletedRun(context: Context): Promise<void> {
  const payload: WorkflowRunCompletedEvent = context.payload as WorkflowRunCompletedEvent;
  if (!payload.workflow_run.id) return;
  const run = await Runs.findOne({ "checks.run_id": { $in: payload.workflow_run.id }})

  if (!run) return
  if (payload.repository.name !== run.config.workflows_repository) return
  
  const check = run.checks.find((check) => check.run_id === payload.workflow_run.id )
  if (!check) return;

  const data: any = {
    owner: run.repository.owner,
    repo: run.repository.name,
    check_run_id: check.checks_run_id,
    name: `${check.name}`,
    status: payload.workflow_run?.status,
    conclusion: payload.workflow_run?.conclusion
  }

  await context.octokit.checks.update(data)
}

export default handleCompletedRun;