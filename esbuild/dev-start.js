import * as esbuild from 'esbuild';
import path from 'path';
import { esbuildSwcPlugin } from './plugins/esbuild-swc.js';
import { createServer, request } from 'http';
import { spawn } from 'child_process';

const clients = [];

esbuild
	.serve(
		{
			servedir: path.join(process.cwd(), 'dist'),
			port: 8080,
		},
		{
			entryPoints: ['./src/index.jsx'],
			bundle: true,
			plugins: [esbuildSwcPlugin()],
		}
	)
	.then(() => {
		createServer((req, res) => {
			const { url, method, headers } = req;
			if (req.url === '/esbuild')
				return clients.push(
					res.writeHead(200, {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						Connection: 'keep-alive',
					})
				);
			const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html`; //for PWA with router
			req.pipe(
				request(
					{ hostname: '0.0.0.0', port: 8080, path, method, headers },
					(prxRes) => {
						res.writeHead(prxRes.statusCode, prxRes.headers);
						prxRes.pipe(res, { end: true });
					}
				),
				{ end: true }
			);
		}).listen(3000);

		setTimeout(() => {
			const op = {
				darwin: ['open'],
				linux: ['xdg-open'],
				win32: ['cmd', '/c', 'start'],
			};
			const ptf = process.platform;
			if (clients.length === 0)
				spawn(op[ptf][0], [...[op[ptf].slice(1)], `http://localhost:8080`]);
		}, 1000);
	});

console.log('dev server running on http://localhost:8080');
