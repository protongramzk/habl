export function createSignal(val) { return [() => val, (newVal) => { val = newVal; }]; }
