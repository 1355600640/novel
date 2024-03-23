// base64 转 Blob

export function base64ToBlob(base64: string): Blob {
  let binary = atob(base64)
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

export function useVModel(
  props: any,
  propName: string,
  computed: any,
  emit: any
) {
  const model = computed({
    get() {
      const proxy = new Proxy(props[propName], {
        get(target, key) {
          return Reflect.get(target, key)
        },
        set(target, key, value) {
          emit('update:' + propName, {
            ...target,
            [key]: value,
          })
          return true
        },
      })
      return proxy
    },
    set(val: any) {
      return emit('update:' + propName, val)
    },
  })
  return model
}
