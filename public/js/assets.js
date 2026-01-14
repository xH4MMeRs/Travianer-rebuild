const tileCache = {};
const maskCache = {};

function getTileImage(x, y) {
    const id = `${x},${y}`;
    if (!tileCache[id]) {
        const img = new Image();
        img.src = `res/bg/${x},${y}.jpg`;
        tileCache[id] = { img: img, ready: false };
        img.onload = () => { tileCache[id].ready = true; };
    }
    return tileCache[id];
}

function getMaskImage(x, y) {
    const id = `${x},${y}`;
    if (!maskCache[id]) {
        const img = new Image();
        img.src = `res/pfad/${x},${y}.png`;
        maskCache[id] = { img: img, ready: false, exists: true };
        img.onload = () => { maskCache[id].ready = true; };
        img.onerror = () => { maskCache[id].exists = false; };
    }
    return maskCache[id];
}

function getLayer2Image(x, y) {
    const id = `${x},${y}`;
    if (layer2Cache.has(id)) return layer2Cache.get(id);

    const data = { img: new Image(), ready: false, exists: true };
    data.img.onload = () => { data.ready = true; };
    data.img.onerror = () => { data.exists = false; }; // Wenn kein Layer-2 existiert
    data.img.src = `res/bg/layer2/${id}.gif`;

    layer2Cache.set(id, data);
    return data;
}
// Vergiss nicht, ganz oben in assets.js den Cache zu erstellen:
const layer2Cache = new Map();