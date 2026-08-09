import { html } from 'satori-html';
import satori from 'satori';
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

export async function GET({ url }) {
	const rawTitle = url.searchParams.get('title');
	const title = rawTitle
		? rawTitle
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.slice(0, 100)
		: null;

	const displayTitle = title ?? 'Simone Ferretti';
	const cta = title ? 'simoneferretti.dev' : 'full-stack developer';
	const titleStyles = title
		? 'font-size: 5rem; line-height: 1.1; padding: 0 2rem;'
		: 'font-size: 7rem; line-height: 1; white-space: nowrap;';
	const ctaStyles = title
		? 'font-size: 2rem; bottom: -1rem;'
		: 'font-size: 2.75rem; right: 0; top: 6.5rem;';

	const markup = html(`
    <div id="image-container">
      <div>
        <h1 style="${titleStyles}">
          <span class="text-gradient">${displayTitle}</span>
        </h1>
        <p id="cta" style="${ctaStyles}"><span>${cta}</span></p>
      </div>
    </div>

    <style>
      #image-container {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #101010;
        color: #a0a0a0;
      }

      #image-container div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-top: 2rem;
      }

      h1 {
        text-align: center;
        margin-bottom: 1em;
      }

      #cta {
        text-transform: uppercase;
        letter-spacing: 0.125em;
        position: absolute;
        font-weight: 200;
        color: grey;
      }

      .text-gradient {
        background-image: linear-gradient(45deg, rgb(136, 136, 136), rgb(230, 250, 250) 30%, rgb(255, 255, 255) 60%);
        background-clip: text;
        color: transparent;
      }
    </style>
  `);

	const fontFiles = [
		readFileSync(`${process.cwd()}/public/assets/Inter_18pt-Light.ttf`),
		readFileSync(`${process.cwd()}/public/assets/Inter_18pt-SemiBold.ttf`),
	];

	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Inter',
				data: fontFiles[0],
				weight: 200,
				style: 'normal',
			},
			{
				name: 'Inter',
				data: fontFiles[1],
				weight: 400,
				style: 'bold',
			},
		],
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: 1200,
		},
	});
	const image = resvg.render();
	const pngBuffer = image.asPng();

	const wantsFormat = url.searchParams.get('format');
	if (wantsFormat === 'png') {
		return new Response(pngBuffer, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	}

	const webpBuffer = await sharp(pngBuffer).webp({ quality: 82 }).toBuffer();

	return new Response(webpBuffer, {
		headers: {
			'Content-Type': 'image/webp',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
