// state.js
const listeners = [];

export const state = {
    isAuthorized: false,
    isLoading: false
};

export function updateState(newState) {
    Object.assign(state, newState);
    listeners.forEach(listener => listener(state));
}

export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}