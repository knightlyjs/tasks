import { Octokit } from '@octokit/rest'
import { fetchTasks } from './fetch'

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN
export const octokit = new Octokit({ auth: GITHUB_TOKEN })

async function distribute() {
  const tasks = await fetchTasks()

  for (const task of tasks) {
    if (task.enabled === false)
      continue

    await octokit.actions.createWorkflowDispatch({
      owner: 'knightlyjs',
      repo: 'tasks',
      // Build, check out https://api.github.com/repos/knightlyjs/tasks/actions/workflows
      workflow_id: 5391077,
      ref: 'main',
      inputs: {
        tasks: JSON.stringify(task),
      },
    })

    console.log(`Scheduled task ${task.owner}/${task.repo}`)
  }
}

distribute()
