import { fail, type Actions } from '@sveltejs/kit';
import { optimize } from 'svgo';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const svg = formData.get('svg');
		const id = formData.get('id');

		if (!svg || typeof svg !== 'string') {
			return fail(400, {
				message: 'No SVG provided'
			});
		}

		const result = treatSvg(svg, typeof id !== 'string' ? generateRandomId() : id);

		return {
			result,
			status: 'success'
		};
	}
} satisfies Actions;

function generateRandomId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function treatSvg(svg: string, id: string) {
	const result = optimize(svg, {
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						mergePaths: {},
						removeUselessStrokeAndFill: {},
						removeViewBox: false,
						removeHiddenElems: false,
						collapseGroups: false,
						removeNonInheritableGroupAttrs: false,
						cleanupIds: {
							remove: false
						},
						cleanupAttrs: {},
						convertPathData: {
							removeUseless: true,
							lineShorthands: true,
							applyTransforms: true
						}
					}
				}
			}
		]
	});

	const svgString = result.data
		.trim()
		.replace(/^<svg/, '<symbol id="icon-' + id + '"')
		.replace(/<\/svg>$/, '</symbol>');

	return svgString;
}
