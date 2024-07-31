export * from './func1'

export function func3() {
  return 3
}

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = /** @type {const} */ (["func1","func3","funcRe"])

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns Call in `resolvers` option of `unplugin-auto-import`.
 */
export function autoImport(map) {
  /** @param {string} name */
  const func = (name) => {
    if (!__UnExportList.includes(name))
      return

    return map && map[name]
      ? {
          name,
          as: map[name],
          from: 'vite-lab',
        }
      : {
          name,
          from: 'vite-lab',
        }
  }
  return func
}

// --- Auto-Generated By Unplugin-Export-Collector ---
