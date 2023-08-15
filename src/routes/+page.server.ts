import { fail, type Actions } from '@sveltejs/kit';
import { optimize } from 'svgo';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const svg = formData.get('svg');
		const slug = formData.get('slug');
		const includeSvg = formData.get('includeSvgTag') === 'on';

		if (!svg || typeof svg !== 'string') {
			return fail(400, {
				message: 'No SVG provided'
			});
		}

		if (!validateSvg(svg)) {
			return fail(400, {
				message: 'Invalid SVG provided'
			});
		}

		const result = treatSvg(svg,
			slug ? slug.toString() : generateRandomId(),
			includeSvg
		);

		return {
			result,
			status: 'success'
		};
	}
} satisfies Actions;

function generateRandomId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function validateSvg(svg: string) {
	const svgRegex = /<svg[^>]+>/;

	if (!svgRegex.test(svg)) {
		return false;
	}

	return true;
}

function treatSvg(svg: string, id: string, includeSvgTag = false) {
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
							applyTransforms: true,
						}
					}
				}
			}
		]
	});

	const svgString = result.data
		.trim()
		.replace(/^<svg/, '<symbol id="' + id + '"')
		.replace(/<\/svg>$/, '</symbol>');

	return svgString;
}
