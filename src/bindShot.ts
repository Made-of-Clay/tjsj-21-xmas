import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';

type GSAP = typeof gsap;

/**
 * @typedef {Object} ShotMap
 * @property {number[]} position
 * @property {number[]} lookAt
 */
export interface ShotMap {
    position: number[]
    lookAt: number[]
}

/**
 * @param {THREE.PerspectiveCamera} camera
 * @param {Record<string, ShotMap>} shots ShotMap { position: number[]; lookAt: number[] }
 * @param {GSAP} [gsapInst] Optional GSAP instance
 */
export function bindShots(
    camera: PerspectiveCamera,
    _orbitControls: OrbitControls | null = null,
    shots: Record<string, ShotMap>,
    gsapInst: GSAP | undefined = gsap,
) {
    if (!camera) throw new ReferenceError('No camera provided');
    if (!shots) throw new ReferenceError('No shots provided');
    gsapInst = gsapInst ?? gsap;
    if (!gsapInst) throw new ReferenceError('GSAP not found');

    const sections = document.querySelectorAll('[data-shot]');
    if (!sections.length) return console.log('No [data-shot] elements found');

    const anim = { duration: 1.2, ease: 'ease-in-out' };

    const getQuat = (pos: ShotMap['position'], look: ShotMap['lookAt']) => {
        const tempCam = new PerspectiveCamera();
        tempCam.position.set(pos[0], pos[1], pos[2]);
        tempCam.lookAt(new Vector3(...look));
        const clone = tempCam.quaternion.clone();
        return clone;
    };

    const moveCamera = (shot: ShotMap) => {
        const { position, lookAt } = shot;
        const q = getQuat(position, lookAt);
        const posObj = { x: position[0], y: position[1], z: position[2] };
        gsapInst.to(camera.position, { ...posObj, ...anim });
        gsapInst.to(camera.quaternion, {
            x: q.x,
            y: q.y,
            z: q.z,
            w: q.w,
            ...anim,
            onUpdate: () => camera.updateMatrixWorld(),
        });
    };

    const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) {
                const name = e.target.getAttribute('data-shot') || '';
                const shot = shots[name];
                if (shot) moveCamera(shot);
            }
        }),
        { threshold: 0.5 },
    );

    sections.forEach((s) => observer.observe(s));
}
