import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { getLoadingManager } from "./getLoadingManager";

export class Tree {
    instance: any;
    loaded = false;
    loading = false;

    async loadModel() {
        const gltfLoader = new GLTFLoader(getLoadingManager());
        this.loading = true;
        try {
            this.instance = await new Promise((resolve, reject) => {
                gltfLoader.load(
                    '/models/xmas-tree.gltf',
                    (gltf) => resolve(gltf.scene),
                    undefined,
                    reject,
                );
            });
            this.loaded = true;
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
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