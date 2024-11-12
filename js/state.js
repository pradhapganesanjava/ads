export const state = {
    isAuthorized: false,
    isLoading: false
};

export function updateState(newState) {
    Object.assign(state, newState);
    updateUI();
}