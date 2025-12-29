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
    assignShotsFromChildren(tree);
    scene.add(tree.instance);
});

addNavListeners();

const shots = {
    nativity: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
    star: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
    gifts: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
    lights: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
    tree: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
    santa: { position: [2, 5, 5.25], lookAt: [0, 0, 0] },
};
// FIXME *something* is happening but not working yet
function assignShotsFromChildren(treeModel: Tree) {
    console.log('assignShotsFromChildren()');
    /** key = child.name (of object/mesh); value = shot name */
    const shotMapping = {
        Wood_Nativity_Ornament: 'nativity',
        Star: 'star',
        Cone007: 'gifts', // trying bottom tree cone to aim roughly at center of gifts
        Trunk: 'lights', // trying Trunk to aim at center of lights/tree
        Cone002: 'tree',
        Sleigh: 'santa',
    } as const;
    treeModel.instance?.traverse((child) => {
        if (!(child.name in shotMapping)) return;
        const shotName = shotMapping[child.name as keyof typeof shotMapping];
        if (!shotName) return console.warn(`No shot found for child name: ${child.name}`);
        shots[shotName].position = [child.position.x, child.position.y, child.position.z];
    });
}
bindShots(camera.instance, undefined, shots, gsap);

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
