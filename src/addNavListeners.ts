function navToPrevious() {
    let currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    
    if (currentLink?.previousElementSibling instanceof HTMLAnchorElement) {
        currentLink = currentLink.previousElementSibling;
    } else {
        currentLink = document.querySelector<HTMLAnchorElement>('nav a:last-of-type');
        console.log('currentLink', currentLink);
    }
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash, ' or previous link');
    }
    currentLink.click();
    scrollToHashSection();
}

function navToNext() {
    let currentLink = document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    if (currentLink?.nextElementSibling instanceof HTMLAnchorElement) {
        currentLink = currentLink.nextElementSibling;
    } else {
        currentLink = document.querySelector<HTMLAnchorElement>('nav a:first-of-type');
    }
    if (!currentLink) {
        return console.warn('Could not find a link for', location.hash, ' or next link');
    }
    currentLink.click();
    scrollToHashSection();
}

const prevKeys = ['ArrowLeft', 'ArrowUp', 'a', 'w'];
const nextKeys = ['ArrowRight', 'ArrowDown', 'd', 's'];

function scrollToHashSection() {
    if (location.hash.substring(1)) {
        const shot = location.hash.substring(1);
        document.querySelector(`[data-shot="${shot}"`)?.scrollIntoView({ behavior: 'smooth' });
    }
}

export function addNavListeners() {
    // Initial scroll
    scrollToHashSection();

    document.querySelector('nav')?.addEventListener('click', async (event) => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for hash to update
        const target = event.target as HTMLAnchorElement;
        if (target.tagName !== 'A') return;
        scrollToHashSection();
    });

    window.addEventListener('keyup', (event) => {
        if (prevKeys.includes(event.key)) {
            navToPrevious();
        } else if (nextKeys.includes(event.key)) {
            navToNext();
        }
    });
}
