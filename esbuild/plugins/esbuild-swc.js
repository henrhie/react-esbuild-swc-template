import fs from 'fs/promises';
import swc from '@swc/core';

const esbuildSwcPlugin = () => {
	return {
		name: 'esbuild-swc',
		setup(build) {
			build.onLoad({ filter: /.jsx?$/gm }, async (args) => {
				let out = {};
				const jsCode = await fs.readFile(args.path, 'utf-8');
				if (jsCode) {
					out = await swc.transform(jsCode, {
						filename: args.path,
						jsc: {
							parser: {
								syntax: 'ecmascript',
								jsx: true,
							},
							target: 'es3',
						},
					});
				}
				return { contents: out.code };
			});

			build.onLoad({ filter: /.tsx?$/gm }, async (args) => {
				let out = {};
				const tsCode = await fs.readFile(args.path, 'utf-8');
				if (tsCode) {
					out = await swc.transform(tsCode, {
						filename: args.path,
						jsc: {
							parser: {
								syntax: 'typescript',
								jsx: true,
							},
							target: 'es3',
						},
					});
				}
				return { contents: out.code };
			});
		},
	};
};

export { esbuildSwcPlugin };
