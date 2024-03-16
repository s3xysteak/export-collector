import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { expGenerator } from '@core/generate'

describe('generate', () => {
  it('expGenerator', async () => {
    const exportList = ['one', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func3', 'func2', 'func1', 'fRe'].sort()

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

// --- Auto-Generated By Export-Collector ---

const exportList = ${JSON.stringify(exportList)} as const

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map?: Partial<AutoImportMap>): Record<string, (string | [string, string])[]> {
  return {
    'export-collector': exportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

// --- Auto-Generated By Export-Collector ---

`

    await expGenerator('./test/parserLab/generateTest.ts')

    const result = await fs.readFile('./test/parserLab/generateTest.ts', 'utf-8')

    expect(result.trim()).toEqual(target.trim())
  })
})
