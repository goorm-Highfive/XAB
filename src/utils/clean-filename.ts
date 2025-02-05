export const cleanFilename = (fileName: string): string =>
  fileName.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/\s+/g, '_')
