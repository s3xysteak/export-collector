export * from './func1'

export function func3() {
  return 3
}

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = /** @type {const} */ (["func1","func3","funcRe"])

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns {Record<string, (string | [string, string])[]>} Use in `imports` option of `unplugin-auto-import`.
 */ 
export function autoImport(map) {
  return {
    'vite-lab': __UnExportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
