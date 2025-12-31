import { AmbientLight, PointLight, PointLightHelper } from 'three'
import { getGui } from './getGui'
import { getScene } from './getScene';

export function addLights() {
    const gui = getGui();
    const lightsFolder = gui.addFolder('Lights');

    const ambientLight = new AmbientLight('white', 0.25);
    ambientLight.visible = false;

    lightsFolder.add(ambientLight, 'visible').name('Ambient Light');

    const pointLight = new PointLight('white', 25, 100);
    pointLight.position.set(4, 10, 1.5);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 4;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 1000;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    // pointLight.visible = false;

    lightsFolder.add(pointLight, 'visible').name('Point Light');
    lightsFolder.add(pointLight.position, 'x', -10, 10, 0.01).name('Point Light X');
    lightsFolder.add(pointLight.position, 'y', -10, 10, 0.01).name('Point Light Y');
    lightsFolder.add(pointLight.position, 'z', -10, 10, 0.01).name('Point Light Z');
    lightsFolder.add(pointLight, 'intensity', 0, 500, 1).name('Point Light Intensity');

    const pointLightHelper = new PointLightHelper(pointLight, 0.25, 'orange');
    pointLightHelper.visible = false;
    lightsFolder.add(pointLightHelper, 'visible').name('Point Light Helper');

    const scene = getScene();
    scene.add(ambientLight, pointLight, pointLightHelper);
}
