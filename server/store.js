import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))

export function createStore(name, seed = []) {
  const file = join(dir, name)
  return {
    read() {
      if (!existsSync(file)) writeFileSync(file, JSON.stringify(seed, null, 2))
      return JSON.parse(readFileSync(file, 'utf8'))
    },
    write(data) {
      writeFileSync(file, JSON.stringify(data, null, 2))
    },
  }
}
