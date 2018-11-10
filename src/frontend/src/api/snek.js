const BASE_URL = 'https://snek-gc.misha.im/api';

function getEndpointURL(endpoint) {
    return `${BASE_URL}/${endpoint}`;
}

export function getAnimals(lat, long) {
    const request = new Request(getEndpointURL('animals'));
    return fetch(request, {
        method: 'GET'
    });
}
