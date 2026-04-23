import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const envFilePath = path.join(repoRoot, '.env')

const stripWrappingQuotes = (value) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const env = {}

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex < 0) continue

    const key = line.slice(0, separatorIndex).trim()
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim())

    if (key) {
      env[key] = value
    }
  }

  return env
}

const envConfig = parseEnvFile(envFilePath)

export const PACKAGE_NAME =
  process.env.PRO_EP_PACKAGE_NAME ||
  envConfig.PRO_EP_PACKAGE_NAME ||
  'pro-element-plus'

export const PACKAGE_DIR =
  process.env.PRO_EP_PACKAGE_DIR ||
  envConfig.PRO_EP_PACKAGE_DIR ||
  './packages/core'

export const PACKAGE_CONFIG = {
  PACKAGE_NAME,
  PACKAGE_DIR,
}

export { envFilePath as packageEnvFilePath, repoRoot as packageConfigRepoRoot }
