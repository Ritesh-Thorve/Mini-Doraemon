export async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error(`Expected an array in ${path}`);
    return data;
}