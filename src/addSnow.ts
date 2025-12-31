import { Points, BufferGeometry, PointsMaterial, Color, BufferAttribute } from 'three';
import { getGui } from './getGui';

export class SnowEffect {
    public snowflakes: Points;
    private positions: Float32Array;
    private velocities: Float32Array;
    private numFlakes = 1000;
    private bounds = { x: 20, y: 15, z: 20 };
    // Suggested range: 0.5 to 2.0 for natural-looking snowfall speed
    public speedMultiplier = 1.0;

    constructor() {
        this.positions = new Float32Array(this.numFlakes * 3);
        this.velocities = new Float32Array(this.numFlakes);

        for (let i = 0; i < this.numFlakes; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * this.bounds.x;
            this.positions[i * 3 + 1] = Math.random() * this.bounds.y + 5;
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * this.bounds.z;
            this.velocities[i] = Math.random() * 2 + 1; // falling speed in units per second
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(this.positions, 3));

        const material = new PointsMaterial({
            color: new Color(0xffffff),
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            depthWrite: false, // so they don't occlude each other improperly
        });

        this.snowflakes = new Points(geometry, material);
        // Removed renderOrder to allow proper depth sorting

        const gui = getGui();
        gui.add(this, 'speedMultiplier').min(0).max(2).step(0.1).name('Snow Speed');
    }

    animate(deltaTime: number) {
        // Clamp deltaTime to prevent large jumps from frame drops
        const clampedDelta = Math.min(deltaTime, 1 / 60);
        const positions = this.snowflakes.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < this.numFlakes; i++) {
            positions[i * 3 + 1] -= this.velocities[i] * clampedDelta * this.speedMultiplier;

            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = this.bounds.y + 5;
                positions[i * 3] = (Math.random() - 0.5) * this.bounds.x;
                positions[i * 3 + 2] = (Math.random() - 0.5) * this.bounds.z;
            }
        }

        this.snowflakes.geometry.attributes.position.needsUpdate = true;
    }
}