import {
    EquirectangularReflectionMapping,
    PCFSoftShadowMap,
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
import { getLoadingManager } from './getLoadingManager';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const scene = getScene();

const hdrLoader = new HDRLoader(getLoadingManager());
hdrLoader.load('/kloppenheim_02_puresky_2k.hdr', (texture) => {
    // Convert to three.js's required format (WebGpu/WebGL)
    texture.mapping = EquirectangularReflectionMapping; 

    // Set the scene's environment
    scene.environment = texture;

    // Optional: Set the background as well if you want the sky to be visible
    scene.background = texture;
})

addLights();

const camera = new ProjectCamera(canvas, true /* include camera controls */);
scene.add(camera.instance);

addHelpers();

const tree = new Tree();
tree.loadModel().then(() => {
    if (!tree.instance) return;
    // maybe update some loader util for UI updates
    console.log(tree.instance);
    scene.add(tree.instance);
});

addNavListeners();

// ===== 📈 STATS & CLOCK =====
const stats = new Stats();
document.body.appendChild(stats.dom);

function tick() {
    requestAnimationFrame(tick);

    stats.begin();

    camera.tick(renderer);

    renderer.render(scene, camera.instance);
    stats.end();
}

tick();
