import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager } from './getLoadingManager';
import { Group, Mesh, Object3DEventMap } from 'three';
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
            this.#addShadows();
            this.loaded = true;
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    #addShadows() {
        if (!this.instance) return;
        this.instance.traverse((child) => {
            if (child.name === 'Snow_Mound') {
                child.receiveShadow = true;
            }
            if (child.name.startsWith('Cone') && (child instanceof Mesh)) {
                child.castShadow = true;
            }
            if (child.name.includes('Gifts') && (child instanceof Mesh)) {
                child.castShadow = true;
            }
            if (child.name === 'Sleigh_Mesh') {
                console.log(child)
                child.castShadow = true;
            }
        });
    }

    animate(_deltaTime: number) {
        if (!this.instance && !this.loaded) return;
        this.lightController.animateLights();
    }
}
