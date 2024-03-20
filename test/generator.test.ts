import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { toLF } from '@s3xysteak/utils'
import { expGenerator } from '@/core/generator'

describe('generate', () => {
  it('expGenerator should work with TS', async () => {
    const exportList = ['custom', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func3', 'func2', 'func1', 'fRe'].sort()

    const target = `
export const one = 1
export const two = 2
export const getThree = () => 3
export function funcIndex() {}
export class ClassIndex {}

export type NumOrStr = number | string

export * from './core/func1'
export * from './core/func2'

export * from '@s3xysteak/utils'

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = ${JSON.stringify(exportList)} as const

export function autoImport(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>): Record<string, (string | [string, string])[]> {
  return {
    'unplugin-export-collector': __UnExportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
`

    await expGenerator('./test/parserLab/generatorTest.ts', { include: ['custom'], exclude: ['one'] })

    const result = await fs.readFile('./test/parserLab/generatorTest.ts', 'utf-8')

    expect(toLF(result)).toBe(`${target.trim()}\n`)
  })

  it('expGenerator should work with JS', async () => {
    const exportList = ['custom', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func3', 'func2', 'func1', 'fRe'].sort()

    const target = `
export const one = 1
export const two = 2
export const getThree = () => 3
export function funcIndex() {}
export class ClassIndex {}

export * from './core/func1'
export * from './core/func2'

export * from '@s3xysteak/utils'

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = /** @type {const} */ (${JSON.stringify(exportList)})

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} map
 * @returns {Record<string, (string | [string, string])[]>} -
 */ 
export function autoImport(map) {
  return {
    'unplugin-export-collector': __UnExportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
`

    await expGenerator('./test/parserLab/generatorTest.js', { include: ['custom'], exclude: ['one'], typescript: false })

    const result = await fs.readFile('./test/parserLab/generatorTest.js', 'utf-8')

    expect(toLF(result)).toBe(`${target.trim()}\n`)
  })
})
