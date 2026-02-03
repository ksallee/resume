import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.DXzYnXBB.js","_app/immutable/chunks/CEwvWSp0.js","_app/immutable/chunks/CVCIiFXJ.js","_app/immutable/chunks/Dh9crtZk.js","_app/immutable/chunks/BV4O5sCK.js","_app/immutable/chunks/DSD6ohZn.js","_app/immutable/chunks/CBLxRMl8.js","_app/immutable/chunks/BT2X-7gG.js"];
export const stylesheets = ["_app/immutable/assets/2.BeEeNdZ2.css"];
export const fonts = [];
