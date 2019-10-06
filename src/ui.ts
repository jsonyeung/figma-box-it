import App from 'components/App.svelte'
import 'styles/index.scss'

// Render App
const app = new App({
  target: document.getElementById('root')
})

// UI Event Trigger
export function postMessage(obj, opt) {
  parent.postMessage({
    pluginMessage: obj
  }, (opt || '*'))
}

export default app