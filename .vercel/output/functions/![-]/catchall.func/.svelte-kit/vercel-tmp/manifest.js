export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","data/resume.json","explosion.mp3","favicon.png","game_music.mp3","game_over.mp3","laser.svg","laser_shooting.mp3","me.jpg","me.png","power_down.mp3","power_up.mp3","ship.svg","ship_collision.mp3","skill_caught.mp3","wrong_answer.mp3"]),
	mimeTypes: {".json":"application/json",".mp3":"audio/mpeg",".png":"image/png",".svg":"image/svg+xml",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.DL4ZPzuI.js",app:"_app/immutable/entry/app.D7TzUYB5.js",imports:["_app/immutable/entry/start.DL4ZPzuI.js","_app/immutable/chunks/BVOPjfJM.js","_app/immutable/chunks/CVCIiFXJ.js","_app/immutable/chunks/CBLxRMl8.js","_app/immutable/entry/app.D7TzUYB5.js","_app/immutable/chunks/CVCIiFXJ.js","_app/immutable/chunks/Dh9crtZk.js","_app/immutable/chunks/CEwvWSp0.js","_app/immutable/chunks/CBLxRMl8.js","_app/immutable/chunks/BV4O5sCK.js","_app/immutable/chunks/BT2X-7gG.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
