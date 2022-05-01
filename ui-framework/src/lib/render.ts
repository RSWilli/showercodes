import { UIEl } from "./elements"

export const render = (el: UIEl, container: string) => {
    const containerEl = document.querySelector(container)
    if (containerEl) {
        containerEl.appendChild(el.el)
    }
}