import fs from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

export function invariant<T extends unknown>(
  condition: T,
  message: string
): asserts condition is NonNullable<T> {
  if (!condition) {
    // TODO: rewrite
    throw new Error(message)
  }
}

export function getPackageJSON(cwd?: string): any {
  const path = resolve(cwd ?? process.cwd(), 'package.json')

  if (fs.existsSync(path)) {
    try {
      const raw = fs.readFileSync(path, 'utf-8')
      const data = JSON.parse(raw)
      return data
    } catch (error) {}
  }
}

export const normalizePath = (localPath: string) => resolve(process.cwd(), localPath)
