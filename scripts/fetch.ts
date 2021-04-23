import axios from 'axios'
import type { KnightlyTask } from 'knightly'

const GIST = 'https://github.com/knightlyjs/tasks/blob/main/tasks.json?raw=true'

export async function fetchTasks() {
  const { data } = await axios.get<KnightlyTask[]>(`${GIST}?t=${+new Date()}`)

  if (typeof data === 'string')
    throw new Error('Unexpected JSON format')

  return data
}
