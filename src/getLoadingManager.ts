import { LoadingManager } from 'three';

let loadingManager: LoadingManager;

export function getLoadingManager() {
    if (!loadingManager)
        loadingManager = new LoadingManager(console.log, undefined, console.error);
    
    return loadingManager;
}