import * as esbuild from 'esbuild';
import path from 'path';
import { esbuildSwcPlugin } from './plugins/esbuild-swc.js';

(async function () {
	await esbuild.build({
		entryPoints: [path.join(process.cwd(), 'src', 'index.jsx')],
		outdir: 'dist',
		bundle: true,
		plugins: [esbuildSwcPlugin()],
		minify: true,
	});
})();
