// base64 转 Blob
export function base64ToBlob(base64: string): Blob {
  let binary = atob(base64)
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' })
}
