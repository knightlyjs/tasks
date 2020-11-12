import { argv } from 'process'
import { promises as fs } from 'fs'
import { fetchTasks } from './fetch'

export async function fetchByName(input: string) {
  const [url, ref] = input.split('@', 2)
  const [owner, repo] = url.split('/', 2)

  const data = await fetchTasks()

  const item = data.find(i => i.owner === owner && i.repo === repo)

  if (!item)
    throw new Error('not found')

  let _ref: string | undefined = ref
  if (!_ref)
    _ref = item.defaultBranch

  if (!_ref)
    throw new Error('no ref')

  if (_ref.startsWith('pr')) {
    item.pulls = [+_ref.slice(2)]
    item.branches = []
  }
  else {
    item.pulls = []
    item.branches = [_ref]
  }

  item.noSkip = true

  console.log(item)

  await fs.writeFile('oncall.json', JSON.stringify(item), 'utf-8')
}

fetchByName(argv[2])
