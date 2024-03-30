/// <reference lib="dom" />

globalThis?._realtimeCss?.close()

const baseUrl = new URL(data.base)

const wsUrl = new URL('/ws', baseUrl)
wsUrl.protocol = 'ws:'
const socket = new WebSocket(wsUrl)

/**
 * @type {HTMLStyleElement}
 */
const styleElement = globalThis?._realtimeCss?.style ?? (() => {
  const style = document.createElement('style')
  document.head.appendChild(style)
  console.log(document.head)
  return style
})()

socket.addEventListener('message', evt => {
  styleElement.innerHTML = evt.data
})

globalThis._realtimeCss = {
  close () {
    socket.close()
    styleElement.remove()
    globalThis._realtimeCss = void 0
    delete globalThis._realtimeCss
  },
  style: styleElement
}