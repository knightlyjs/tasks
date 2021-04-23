import axios from 'axios'
import type { KnightlyTask } from 'knightly'

const GIST = 'https://raw.githubusercontent.com/knightlyjs/tasks/main/tasks.json'

export async function fetchTasks() {
  const { data } = await axios.get<KnightlyTask[]>(`${GIST}?t=${+new Date()}`)

  if (typeof data === 'string')
    return JSON.parse(data)

  return data
}
