import { promises as fs } from 'fs'
import { fetchTasks } from './fetch'

const REGEX = /<!--TASKS-START-->[\s\S]*<!--TASKS-END-->/m
const GITHUB = 'https://github.com'
const NPM = 'https://npmjs.com'

async function run() {
  const data = await fetchTasks()

  const table: string[][] = []

  for (const task of data) {
    if (task.enabled === false)
      continue

    table.push([
      `[${task.owner}/${task.repo}](${GITHUB}/${task.owner}/${task.repo})`,
      (task.packagesNameMap ? Object.values(task.packagesNameMap) : [task.publishName])
        .map(name => `[\`${name}\`](${NPM}/package/${name})`).join('<br>'),
      (task.branches || []).map(b => `[\`${b}\`](${NPM}/package/${task.publishName}/v/${paramCase(b)})`).join(' '),
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

function paramCase(str) {
  return str.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)
}

run()
