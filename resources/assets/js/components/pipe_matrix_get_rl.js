// Linearized data
const data = [
    {x: 0.00142065, y: 0.0373832},
    {x: 0.00242791, y: 0.0404984},
    {x: 0.00463587, y: 0.0498442},
    {x: 0.00822106, y: 0.0654206},
    {x: 0.0145789, y: 0.0965732},
    {x: 0.0258535, y: 0.130841},
    {x: 0.0582975, y: 0.186916},
    {x: 0.176681, y: 0.274143},
    {x: 0.436968, y: 0.395639},
    {x: 1.04149, y: 0.548287},
    {x: 1.6531, y: 0.641745},
    {x: 2.6728, y: 0.735202},
    {x: 4.56784, y: 0.82243},
    {x: 7.1175, y: 0.88162},
    {x: 11.5079, y: 0.925234},
    {x: 19.6671, y: 0.950156},
    {x: 28.4612, y: 0.965732},
    {x: 53.3491, y: 0.978193},
    {x: 86.257, y: 0.984424},
    {x: 107.672, y: 0.984424}
]

// Linear interpolation
function interpolate(x, {x:x1, y:y1}, {x:x2, y:y2}) {
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1)
}

// Linear interpolation but in a graph with the x axis in log scale
function logInterpolate(x, p1, p2) {
    const p1Mod = {x: Math.log10(p1.x), y: p1.y}
    const p2Mod = {x: Math.log10(p2.x), y: p2.y}
    return interpolate(Math.log10(x), p1Mod, p2Mod)
}

export default function getRL(x) {
    if (isNaN(x)) return NaN
    // Handle edge cases
    if (x <= data[0].x) return data[0].y
    if (x >= data[data.length - 1].x) return data[data.length - 1].y
    // Find the points between which we want to interpolate
    let p1, p2
    for (let i = 1; i < data.length; ++i)
        if (x < data[i].x) {
            p1 = data[i-1]
            p2 = data[i]
            break
        }
    // Return interpolation between the two points
    return logInterpolate(x, p1, p2)
}
