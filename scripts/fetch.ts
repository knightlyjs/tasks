import axios from 'axios'
import type { KnightlyTask } from 'knightly'

const GIST = 'https://gist.githubusercontent.com/knightly-bot/eaad903eb6a18b78ec5060749ce28683/raw/tasks.json'

export async function fetchTasks() {
  const { data } = await axios.get<KnightlyTask[]>(`${GIST}?t=${+new Date()}`)

  if (typeof data === 'string')
    throw new Error('Unexpected JSON format')

  return data
}
