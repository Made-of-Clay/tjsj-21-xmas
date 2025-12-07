function navToPrevious() {
    const currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash);
    }
    (currentLink.previousElementSibling as HTMLAnchorElement | null)?.click();
}

function navToNext() {
    const currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash);
    }
    (currentLink.nextElementSibling as HTMLAnchorElement | null)?.click();
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
