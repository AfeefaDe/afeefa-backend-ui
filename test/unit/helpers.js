export function updateNow ($wrapper) {
  $wrapper.update()
  $wrapper.vm._watcher.update()
  $wrapper.vNode = $wrapper.vm._vnode
}

export function setProperty ($wrapper, name, value) {
  $wrapper.vm[name] = value
  for (let watcher of $wrapper.vm._watchers) {
    if (watcher.expression === name) {
      watcher.cb.call($wrapper.vm, value)
    }
  }
}
