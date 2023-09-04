import { fail, type Actions } from '@sveltejs/kit';
import { optimize } from 'svgo';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const svg = formData.get('svg');
		const slug = formData.get('slug');
		const includeSvg = formData.get('includeSvgTag') === 'on';
		const replaceColors = formData.get('replaceColors') === 'on';

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
			includeSvg,
			replaceColors
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


type OptimizationOptions = {
	plugins: Array<{
		name: string,
		params: {
			overrides: Record<string, any>
		}
	}>
};

function optimizeSVG(svg: string, options: OptimizationOptions): string {
	return optimize(svg, options).data.trim();
}

function wrapWithSymbol(svg: string, id: string): string {
	return svg.replace(/^<svg/, `<symbol id="${id}"`).replace(/<\/svg>$/, '</symbol>');
}

function replaceSVGColors(svg: string): string {
	return svg.replace(/fill="(?![^"]*none)[^"]+"/g, 'fill="currentColor"')
		.replace(/stroke="[^"]+"/g, 'stroke="currentColor"');
}


function treatSvg(svg: string, id: string, wrapSymbolWithSvg = false, replaceColors = false): string {
	const optimizationOptions: OptimizationOptions = {
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
	};

	let svgString = optimizeSVG(svg, optimizationOptions);
	svgString = wrapWithSymbol(svgString, id);

	if (replaceColors) {
		svgString = replaceSVGColors(svgString);
	}

	if (wrapSymbolWithSvg) {
		svgString = `<svg>${svgString}</svg>`;
	}

	return svgString;
}

