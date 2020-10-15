import { promises as fs } from 'fs'
import axios from 'axios'
import type { KnightlyTask } from 'knightly'

const GIST = 'https://gist.githubusercontent.com/knightly-bot/eaad903eb6a18b78ec5060749ce28683/raw/tasks.json'
const REGEX = /<!--TASKS-START-->[\s\S]*<!--TASKS-END-->/m
const GITHUB = 'https://github.com'
const NPM = 'https://npmjs.com'

async function run() {
  const { data } = await axios.get<KnightlyTask[]>(GIST)

  const table: string[][] = []

  for (const task of data) {
    if (task.enabled === false)
      continue

    table.push([
      `[${task.owner}/${task.repo}](${GITHUB}/${task.owner}/${task.repo})`,
      (task.packagesNameMap ? Object.values(task.packagesNameMap) : [task.publishName])
        .map(name => `[\`${name}\`](${NPM}/package/${name})`).join('<br>'),
      (task.branches || []).map(b => `[\`${b}\`](${NPM}/package/${task.publishName}/v/${b})`).join(' '),
      (task.pulls || []).map(p => `[#${p}](${NPM}/package/${task.publishName}/v/pr${p})`).join(' '),
    ])
  }

  const tableMD = `
| Repo | Packages | Branches | PRs |
| ---- | -------- | -------- | --- |
${table.map(i => `| ${i.join(' | ')} |`).join('\n')}
`.trim()

  let readme = await fs.readFile('README.md', 'utf-8')

  readme = readme.replace(REGEX, `<!--TASKS-START-->\n${tableMD}\n<!--TASKS-END-->`)

  await fs.writeFile('README.md', readme, 'utf-8')
}

run()
