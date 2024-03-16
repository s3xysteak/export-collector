import { join } from 'node:path'
import process from 'node:process'
import { promises as fs } from 'node:fs'
import { getPkg } from '@utils/general'
import { expCollector } from './parser'

const comment = '// --- Auto-Generated By Export-Collector ---'
const firstIndex = (content: string) => content.indexOf(comment)
const lastIndex = (content: string) => content.lastIndexOf(comment) + comment.length

export interface expGeneratorOptions {
  base: string
  pkgName: string
}
export async function expGenerator(path: string, options?: Partial<expGeneratorOptions>) {
  const pkg = await getPkg()

  const {
    base = process.cwd(),
    pkgName = pkg.name,
  } = options ?? {}

  const targetPath = join(base, path)

  const expList = await expCollector(path, base)
  const _content = await fs.readFile(targetPath, 'utf-8')

  const _firstComment = firstIndex(_content)

  _firstComment === -1 && await fs.writeFile(targetPath, `${_content}\n
${comment}
${comment}
`)

  const content = await fs.readFile(targetPath, 'utf-8')
  const firstComment = firstIndex(content)
  const lastComment = lastIndex(content)

  const val = `${`${content.substring(0, firstComment).trim()}

${comment}

const exportList = ${JSON.stringify(expList.filter(i => i !== 'autoImport').sort())} as const

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map?: Partial<AutoImportMap>): Record<string, (string | [string, string])[]> {
  return {
    '${pkgName}': exportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

${comment}
${content.substring(lastComment)}
`.trim()}\n`

  await fs.writeFile(targetPath, val)
}
