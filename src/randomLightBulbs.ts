// Christmas Light String with Random Colors for js
import { Color, Group, Mesh, MeshStandardMaterial, Object3DEventMap, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ChristmasLightController {
    lightColors = [
        new Color(1, 0, 0),      // Red
        new Color(0, 1, 0),      // Green
        new Color(0, 0, 1),      // Blue
        new Color(1, 1, 0),      // Yellow
        new Color(1, 0.5, 0),    // Orange
        new Color(1, 0, 1),      // Magenta
        new Color(0, 1, 1),      // Cyan
        new Color(1, 1, 1),      // White
        new Color(0.5, 0, 1),    // Purple
        new Color(1, 0.5, 0.8),  // Pink
    ];
    lightBulbMeshes: Mesh<Object3DEventMap>[] = [];
    originalMaterials = new Map<string, MeshStandardMaterial>();
    animationSpeed = 0.002;
    time = 0;

    // Load the GLTF model and setup random light colors
    async loadModel(scene: Scene, modelPath = 'models/xmas-toonish.gltf') {
        const loader = new GLTFLoader();
        
        return new Promise((resolve, reject) => {
            loader.load(modelPath, (gltf) => {
                scene.add(gltf.scene);
                this.setupRandomLightBulbs(gltf.scene);
                resolve(gltf);
            }, undefined, reject);
        });
    }

    // Find all light bulb meshes and assign random colors
    setupRandomLightBulbs(gltfScene: Mesh<Object3DEventMap>) {
        gltfScene.traverse((child) => {
            if (child.isMesh && child.name === 'Light Bulb') {
                this.lightBulbMeshes.push(child);
                
                // Store original material for reference
                if (child.material && !this.originalMaterials.has(child.material.uuid)) {
                    this.originalMaterials.set(child.material.uuid, child.material.clone());
                }
                
                // Create a new emissive material with random color
                const randomColor = this.getRandomColor();
                const emissiveMaterial = this.createEmissiveMaterial(randomColor);
                
                // If the mesh has multiple materials (array), replace the emissive one
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(mat => {
                        if (mat.name === 'Light Bulb Variable Color') {
                            return emissiveMaterial;
                        }
                        return mat;
                    });
                } else {
                    child.material = emissiveMaterial;
                }
            }
        });

        console.log(`Found ${this.lightBulbMeshes.length} light bulbs`);
    }

    // Create an emissive material with the specified color
    createEmissiveMaterial(color: Color, intensity = 2.0) {
        return new MeshStandardMaterial({
            color: new Color(0.1, 0.1, 0.1), // Dark base color
            emissive: color,
            emissiveIntensity: intensity,
            metalness: 0,
            roughness: 0.3,
            transparent: true,
            opacity: 0.9
        });
    }

    // Get a random color from the predefined palette
    getRandomColor() {
        return this.lightColors[Math.floor(Math.random() * this.lightColors.length)].clone();
    }

    // Animate the light bulbs (optional twinkling effect)
    animateLights(deltaTime: number) {
        this.time += deltaTime;
        
        this.lightBulbMeshes.forEach((bulb, index) => {
            // Create a unique phase for each bulb
            const phase = (index * 0.5) + this.time * this.animationSpeed;
            const intensity = 1.5 + Math.sin(phase) * 0.5; // Oscillate between 1.0 and 2.0
            
            if (bulb.material) {
                bulb.material.emissiveIntensity = intensity;
            }
        });
    }

    // Randomize colors again (useful for testing or effects)
    randomizeColors() {
        this.lightBulbMeshes.forEach((bulb) => {
            const randomColor = this.getRandomColor();
            if (bulb.material) {
                bulb.material.emissive.copy(randomColor);
            }
        });
    }

    // Set all bulbs to a specific color
    setAllBulbsColor(color) {
        this.lightBulbMeshes.forEach((bulb) => {
            if (bulb.material) {
                bulb.material.emissive.copy(color);
            }
        });
    }

    // Toggle lights on/off
    toggleLights(on = true) {
        const intensity = on ? 2.0 : 0.0;
        this.lightBulbMeshes.forEach((bulb) => {
            if (bulb.material) {
                bulb.material.emissiveIntensity = intensity;
            }
        });
    }

    // Dispose of materials when done
    dispose() {
        this.lightBulbMeshes.forEach((bulb) => {
            if (bulb.material) {
                if (Array.isArray(bulb.material)) {
                    bulb.material.forEach(mat => mat.dispose());
                } else {
                    bulb.material.dispose();
                }
            }
        });
        this.originalMaterials.clear();
        this.lightBulbMeshes = [];
    }
}

// Example usage
export default ChristmasLightController;

// Alternative: Direct function approach for simpler use cases
export function setupRandomLightBulbs(gltfScene) {
    const lightColors = [
        new Color(1, 0, 0),      // Red
        new Color(0, 1, 0),      // Green  
        new Color(0, 0, 1),      // Blue
        new Color(1, 1, 0),      // Yellow
        new Color(1, 0.5, 0),    // Orange
        new Color(1, 0, 1),      // Magenta
        new Color(0, 1, 1),      // Cyan
        new Color(1, 1, 1),      // White
    ];

    gltfScene.traverse((child) => {
        if (child.isMesh && child.name === 'Light Bulb') {
            const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
            
            child.material = new MeshStandardMaterial({
                color: new Color(0.1, 0.1, 0.1),
                emissive: randomColor,
                emissiveIntensity: 2.0,
                metalness: 0,
                roughness: 0.3,
                transparent: true,
                opacity: 0.9
            });
        }
    });
}