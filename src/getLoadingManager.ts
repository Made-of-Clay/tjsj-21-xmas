import { LoadingManager } from 'three';

let loadingManager: LoadingManager;

let progressLoader: ((url: string, loaded: number, total: number) => void) = () => { };

export function getLoadingManager() {
    if (!loadingManager)
        loadingManager = new LoadingManager(console.log, progressLoader, console.error);

    return loadingManager;
}

export function setProgressLoader(callback: (url: string, loaded: number, total: number) => void) {
    progressLoader = callback;
}