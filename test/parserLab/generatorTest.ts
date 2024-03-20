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

const exportList = ["ClassIndex","custom","fRe","func1","func2","func3","funcIndex","getThree","two"] as const

export type UnpluginExportCollectorAutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map?: Partial<UnpluginExportCollectorAutoImportMap>): Record<string, (string | [string, string])[]> {
  return {
    'unplugin-export-collector': exportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
