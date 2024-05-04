import process from 'node:process'
import { promises as fs } from 'node:fs'
import { isUndefined } from '@s3xysteak/utils'
import { resolve } from 'pathe'
import { expCollector } from './parser'
import { findPath, getPkg } from './utils'

const comment = '// --- Auto-Generated By Unplugin-Export-Collector ---'
const firstIndex = (content: string) => content.indexOf(comment)
const lastIndex = (content: string) => content.lastIndexOf(comment) + comment.length

interface ExpGeneratorDataOptions {
  /**
   * The base path of the project.
   * @default process.cwd()
   */
  base: string

  /**
   * The package name of the project. The default value is the name of the `package.json`.
   * @default pkg.name
   */
  pkgName: string

  /**
   * The list of exports to include.
   * @default []
   */
  include: string[]

  /**
   * The list of exports to exclude.
   * @default []
   */
  exclude: string[]

  /**
   * The name of the export function.
   * @default 'autoImport'
   */
  rename: string

  /**
   * Whether to use TypeScript. The default value will be auto detected by `package.json`.
   * @default isTs
   */
  typescript: boolean

  /**
   * Whether to export the function as default.
   * @default false
   */
  exportDefault: boolean
}

export interface ExpGeneratorOptions extends ExpGeneratorDataOptions {
  /**
   * The path to write the generated file. The default value is the path of the entry file.
   */
  writeTo: string
}

export async function expGenerator(path: string, options: Partial<ExpGeneratorOptions> = {}) {
  const {
    data,
    dataRaw,
    targetPath,
    pkgContext: { isTs },
  } = await expGeneratorData(path, options)

  const { base = process.cwd() } = options

  if (isUndefined(options?.writeTo))
    return await fs.writeFile(targetPath, data)

  const extension = (path: string) => /\.\w+?$/.test(path)
    ? path
    : `${path}.${isTs ? 'ts' : 'js'}`

  const writeTo = resolve(base, extension(options.writeTo))

  await fs.writeFile(writeTo, dataRaw)
}

export async function expGeneratorData(path: string, options?: Partial<ExpGeneratorDataOptions>) {
  const { raw: pkg, isTs } = await getPkg()

  const {
    base = process.cwd(),
    pkgName = pkg.name,
    include = [],
    exclude = [],
    rename = 'autoImport',
    typescript = isTs,
    exportDefault = false,
  } = options ?? {}

  exclude.push(rename)

  const targetPath = await findPath(path, base)

  const expList = await expCollector(path, base)
  let content = await fs.readFile(targetPath, 'utf-8')

  const _firstComment = firstIndex(content)

  if (_firstComment === -1) {
    content = `${content}\n
${comment}
${comment}
`
  }

  const firstComment = firstIndex(content)
  const lastComment = lastIndex(content)

  const exportList = [...expList, ...include].filter(i => !exclude.includes(i)).sort()

  const getTemplate = (body: string) => `
${content.substring(0, firstComment).trim()}

${comment}

${body.trim()}

${comment}

${content.substring(lastComment).trim()}
`

  const rawTs = `
const __UnExportList = ${JSON.stringify(exportList)} as const

/**
 * @returns Call in \`resolvers\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>) {
  return (name: string) => {
    if (!__UnExportList.includes(name as any))
      return

    return map && (map as any)[name]
      ? {
          name,
          as: (map as any)[name],
          from: '${pkgName}',
        }
      : {
          name,
          from: '${pkgName}',
        }
  }
}
`
  const TS = getTemplate(rawTs)

  const rawJs = `
const __UnExportList = /** @type {const} */ (${JSON.stringify(exportList)})

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns Call in \`resolvers\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map) {
  /** @param {string} name */
  const func = (name) => {
    if (!__UnExportList.includes(name))
      return

    return map && map[name]
      ? {
          name,
          as: map[name],
          from: '${pkgName}',
        }
      : {
          name,
          from: '${pkgName}',
        }
  }
  return func
}
`
  const JS = getTemplate(rawJs)

  const val = typescript ? TS : JS
  const valRaw = typescript ? rawTs : rawJs
  const dataRaw = `${comment}

${valRaw.trim()}

${comment}
`

  return {
    data: `${val.trim()}\n`,
    dataRaw,
    targetPath,
    pkgContext: {
      pkg,
      isTs,
    },
  }
}
