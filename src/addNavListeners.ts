function navToPrevious() {
    let currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    
    if (currentLink?.previousElementSibling instanceof HTMLAnchorElement) {
        currentLink = currentLink.previousElementSibling;
    } else {
        currentLink = document.querySelector<HTMLAnchorElement>('nav a:first-of-type');
        console.log('currentLink', currentLink);
    }
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash, ' or previous link');
    }
    currentLink.click();
}

function navToNext() {
    let currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    if (currentLink?.nextElementSibling instanceof HTMLAnchorElement) {
        currentLink = currentLink.nextElementSibling;
    } else {
        currentLink = document.querySelector<HTMLAnchorElement>('nav a:last-of-type');
    }
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash, ' or next link');
    }
    currentLink.click();
}

const prevKeys = ['ArrowLeft', 'ArrowUp', 'a', 'w'];
const nextKeys = ['ArrowRight', 'ArrowDown', 'd', 's'];

export function addNavListeners() {
    window.addEventListener('hashchange', () => {
        const currentLink = document.querySelector(`[href="${location.hash}"]`);
        // TODO focus appropriate section
        console.log(currentLink, location.hash)
    });

    window.addEventListener('keyup', (event) => {
        if (prevKeys.includes(event.key)) {
            navToPrevious();
        } else if (nextKeys.includes(event.key)) {
            navToNext();
        }
    });
}
