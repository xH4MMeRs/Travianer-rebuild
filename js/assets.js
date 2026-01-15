// js/assets.js

const tileCache = {};
const maskCache = {};
const layer2Cache = {}; 

function getTileImage(x, y) {
    const id = `${x},${y}`;
    if (!tileCache[id]) {
        const img = new Image();
        img.src = `res/bg/${id}.jpg`;
        tileCache[id] = { img: img, ready: false };
        img.onload = () => { tileCache[id].ready = true; };
    }
    return tileCache[id];
}

function getMaskImage(x, y) {
    const id = `${x},${y}`;
    if (!maskCache[id]) {
        const img = new Image();
        img.src = `res/pfad/${id}.png`;
        maskCache[id] = { img: img, ready: false, exists: true };
        img.onload = () => { 
            maskCache[id].ready = true; 
            // Kleiner Trick: Wenn das Bild lädt, triggern wir 
            // eine Info, dass der Pfad jetzt berechnet werden könnte.
        };
        img.onerror = () => { maskCache[id].exists = false; };
    }
    return maskCache[id];
}

function getLayer2Image(x, y) {
    const id = `${x},${y}`;
    if (!layer2Cache[id]) {
        const img = new Image();
        // Hier auf .gif geändert für deine Layer-2 Objekte
        img.src = `res/bg/layer2/${id}.gif`; 
        layer2Cache[id] = { img: img, ready: false, exists: true };
        
        img.onload = () => { layer2Cache[id].ready = true; };
        img.onerror = () => { 
            layer2Cache[id].exists = false; 
            // Kleiner Trick: Wir loggen das nicht als Fehler, 
            // da viele Tiles einfach keinen Layer 2 haben.
        };
    }
    return layer2Cache[id];
}