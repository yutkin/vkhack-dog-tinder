import animals from './stub_animals.json';

const BASE_URL = 'https://snek-gc.misha.im/api';

function getEndpointURL(endpoint) {
    return `${BASE_URL}/${endpoint}`;
}

export async function getAnimals(userId, lat, lon) {
    const request = new Request(getEndpointURL(`animals?user_id=${userId}`));
    const response = await fetch(request, {
        method: 'GET'
    });
    return response.json();
    // return Promise.resolve(animals);
}

export async function likeAnimal(animalId, userId) {
    const request = new Request(getEndpointURL('animals/like'));
    const response = await fetch(request, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: animalId,
            user_id: userId
        })
    });
    return response;
}

export async function getMatches(userId) {
    const request = new Request(getEndpointURL(`matches_for/${userId}`));
    const response = await fetch(request, {
        method: 'GET'
    });
    return response.json();
    // return Promise.resolve(animals);
}
