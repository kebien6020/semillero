// Create custom throttled events that only occur once per animation frame
// Code from https://developer.mozilla.org/en-US/docs/Web/Events/resize
const throttle = (type, name, obj) => {
    obj = obj || window
    let running = false
    const func = function() {
        if (running)  return
        running = true
        requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name))
            running = false
        })
    }
    obj.addEventListener(type, func)
}

export default throttle
