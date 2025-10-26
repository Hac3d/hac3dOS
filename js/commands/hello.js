// hello.js
// a hello world program
import { windowSystem } from "../libs/windowSystem.js"

export function helloWorldProgram({ print, commandContainer, start, stop }) {
    windowSystem(print, commandContainer, start, stop, `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=dw_IxH5eVXkqAXaw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`)
}