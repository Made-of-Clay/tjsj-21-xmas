import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager } from './getLoadingManager';
import { Group, Object3DEventMap } from 'three';
import ChristmasLightController from './randomLightBulbs';

export class Tree {
    instance: Group<Object3DEventMap> | null = null;
    loaded = false;
    loading = false;
    lightController = new ChristmasLightController(); 

    async loadModel() {
        const gltfLoader = new GLTFLoader(getLoadingManager());
        this.loading = true;
        try {
            this.instance = await new Promise<Group<Object3DEventMap>>((resolve, reject) => {
                gltfLoader.load(
                    '/models/xmas-toonish.gltf',
                    (gltf) => resolve(gltf.scene),
                    undefined,
                    reject,
                );
            });
            this.lightController.setupRandomLightBulbs(this.instance);
            this.loaded = true;
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    animate(deltaTime: number) {
        if (!this.instance && !this.loaded) return;
        this.lightController.animateLights(deltaTime);
    }
}
// Loads tree model into the scene
// model will include ornaments in places of interest, a star, some presents beneath
// list of things to expect
// - tree
// - nativity ornament
// - star topper
// - presents
// - lights
// - wreath (nearby?)
// - Santa ornament/hat/silhouette?
// - maybe candy canes hanging from tree
// room corner holds tree (make it simple and cozy; flickering fire effect would be nice)
// QUESTION: what post processing effect for lights? bloom? glowy materials?