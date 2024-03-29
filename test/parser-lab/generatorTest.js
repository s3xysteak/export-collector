export const one = 1
export const two = 2
export const getThree = () => 3
export function funcIndex() {}
export class ClassIndex {}

export * from './core/func1'
export * from './core/func2'

export * from '@s3xysteak/utils'

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = /** @type {const} */ (["ClassIndex","custom","fRe","func1","func2","func3","funcIndex","getThree","two"])

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns {Record<string, (string | [string, string])[]>} Use in `imports` option of `unplugin-auto-import`.
 */ 
export function autoImport(map) {
  return {
    'unplugin-export-collector': __UnExportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
