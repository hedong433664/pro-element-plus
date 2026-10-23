import { x as extract } from 'tar'

export const extractPackageArchive = (file, cwd) =>
  extract({ file, cwd, strict: true, preservePaths: false })
