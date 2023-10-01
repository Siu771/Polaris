/* Stands for Web Prxxy Manager because the keywork Prxxy is usually blocked */

const load = () => {
    let xor = {
        encode: (str, key = 2) => {
            if (!str) return str;
            return encodeURIComponent(str.split('').map((e, i) => i % key ? String.fromCharCode(e.charCodeAt(0) ^ key) : e).join(''));
        },
        decode: (str, key = 2) => {
            if (!str) return str;
            return decodeURIComponent(str).split('').map((e, i) => i % key ? String.fromCharCode(e.charCodeAt(0) ^ key) : e).join('');
        }
    };
    
    let workerLoaded = false;
    let loadWorker = async () => await navigator.serviceWorker.register('./sw.js', {
        scope: '/service/',
    });

    (async () => {
        await loadWorker();
        workerLoaded = true;
    })();

    const form = document.querySelector('#wpf');
    const query = document.querySelector('#query');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (typeof navigator.serviceWorker === 'undefined') new PolarisError('Failed to load Prxxy');
        if (!workerLoaded) await loadWorker();
    
        const url = /^(http(s)?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/.test(query.value) ?
            ((!query.value.startsWith('http://') && !query.value.startsWith('https://')) ? 'https://' + query.value : query.value) :
            'https://www.google.com/search?q=' + encodeURIComponent(query.value);
        
        location.href = `/service/${xor.encode(url)}`;
    });
}

export default { load };
