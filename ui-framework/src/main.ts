import { derived, staticStore, writable, Store } from './lib/stores'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
    <h1>Hello Vite</h1>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const s1 = writable(1)

const s2 = writable("foo")

const v1 = staticStore("bar")

const r1 = derived([s1, s2, v1], (values) => {
    return values[0] + values[1]
})

const t1 = r1 as Store<string>

if (t1.type == "readable") {
    t1
}