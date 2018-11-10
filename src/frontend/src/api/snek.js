import animals from './stub_animals.json';

const BASE_URL = 'https://snek-gc.misha.im/api';

function getEndpointURL(endpoint) {
    return `${BASE_URL}/${endpoint}/`;
}

export async function getAnimals(lat, long) {
    const request = new Request(getEndpointURL('animals'));
    const response = await fetch(request, {
        method: 'GET'
    });
    return response.json();
    // return Promise.resolve(animals);
}
