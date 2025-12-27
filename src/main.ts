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
import { getLoadingManager } from './getLoadingManager';
import { getGui } from './getGui';
import { gsap } from 'gsap';
import { bindShots } from './bindShot';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const scene = getScene();

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

bindShots(camera.instance, undefined, {}, gsap);

// ===== 📈 STATS & CLOCK =====
const stats = new Stats();
document.body.appendChild(stats.dom);

const timer = new Timer();
let previousTime = 0;

function tick() {
    requestAnimationFrame(tick);

    stats.begin();

    timer.update();
    const elapsedTime = timer.getElapsed();
    const deltaTime = elapsedTime - previousTime;
    tree.animate(deltaTime);
    
    camera.tick(renderer);

    renderer.render(scene, camera.instance);
    stats.end();
}

tick();
