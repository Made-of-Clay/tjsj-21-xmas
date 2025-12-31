import {
    EquirectangularReflectionMapping,
    PCFSoftShadowMap,
    Timer,
    WebGLRenderer,
} from 'three';
import Stats from 'stats.js';
import './style.css';
import { addLights } from './addLights';
import { addHelpers } from './addHelpers';
import { getScene } from './getScene';
import { ProjectCamera } from './ProjectCamera';
import { addNavListeners } from './addNavListeners';
import { Tree } from './Tree';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager, setProgressLoader } from './getLoadingManager';
import { getGui } from './getGui';
import { bindShots } from './bindShot';
import { SnowEffect } from './addSnow';

const isDebugMode = location.search === '?debug';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const scene = getScene();

const overlayEl = document.getElementById('overlay');
const progressEl = document.getElementById('progress');
if (!overlayEl) throw new Error('Overlay element not found');
if (!progressEl) throw new Error('Progress element not found');

document.getElementById('enter')?.addEventListener('click', () => {
    overlayEl.setAttribute('data-entered', '');
    setTimeout(() => overlayEl.style.display = 'none', 3000);
});

setProgressLoader((_url, loaded, total) => {
    const percent = (loaded / total) * 100;
    progressEl.innerText = `${Math.round(percent)}`;
    if (loaded === total) {
        setTimeout(() => {
            overlayEl.setAttribute('data-loaded', '');
        }, 1000);
    }
});

const gui = getGui();

const hdrLoader = new HDRLoader(getLoadingManager());
hdrLoader.load('/kloppenheim_02_puresky_2k.hdr', (texture) => {
    // Convert to three.js's required format (WebGpu/WebGL)
    texture.mapping = EquirectangularReflectionMapping; 

    // Set the scene's environment
    scene.environment = texture;
    scene.environmentIntensity = 0.65;
    gui.add(scene, 'environmentIntensity').min(0).max(1).step(0.01);

    // Optional: Set the background as well if you want the sky to be visible
    scene.background = texture;
});

addLights();

const camera = new ProjectCamera(canvas, false /* include camera controls */);
scene.add(camera.instance);

addHelpers();

const tree = new Tree();
tree.loadModel().then(() => {
    if (!tree.instance) return;
    scene.add(tree.instance);
});

const snow = new SnowEffect();
scene.add(snow.snowflakes);

addNavListeners();

const shots = {
    nativity: { position: [0.4, 7, 1], lookAt: [0, 6.25, 0] },
    star: { position: [0.4, 7, 1], lookAt: [0, 7, 0] },
    gifts: { position: [2.25, 5, 2.25], lookAt: [0, 1, 0] },
    lights: { position: [2, 5, 5.25], lookAt: [0, 4, 0] },
    tree: { position: [3.5, 5, 5.25], lookAt: [0, 4, 0] },
    santa: { position: [2, 6, -1.5], lookAt: [1, 0, -5] },
};

bindShots(camera.instance, undefined, shots, (name: string) => {
    if (name) {
        location.hash = `#${name}`;
    }
});

// ===== 📈 STATS & CLOCK =====
let stats: Stats | undefined;
if (isDebugMode) {
    stats = new Stats();
    document.body.appendChild(stats.dom);
    gui.show();
}

const timer = new Timer();
let previousTime = 0;

function tick() {
    requestAnimationFrame(tick);

    isDebugMode && stats?.begin();

    timer.update();
    const elapsedTime = timer.getElapsed();
    const deltaTime = elapsedTime - previousTime;
    tree.animate(deltaTime);
    snow.animate(deltaTime);

    camera.tick(renderer);

    renderer.render(scene, camera.instance);

    isDebugMode && stats?.end();
}

tick();
