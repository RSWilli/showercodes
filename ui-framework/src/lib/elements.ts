import { Store } from "./stores"

export interface UIEl {
    el: Element
}

interface Attrs {
    // "class"?: {
    //     [key: string]: boolean
    // }

    [key: string]: Store<string | number | boolean>
}

export const div = (attrs: Attrs, children: Store<Store<UIEl>[]>): UIEl => {
    const el = document.createElement('div')
    const me = {
        el
    }

    return me
}

// export const text = (text: string): UIEl => {
//     const el = document.createTextNode(text)
//     return {
//         el
//     }
// }