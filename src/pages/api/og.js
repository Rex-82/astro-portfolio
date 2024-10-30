import { html } from 'satori-html';
import satori from 'satori';
import { readFileSync } from 'node:fs';

export async function GET() {
	const markup = html(`
  <div id="image-container">
    <div>
      <h1>
        <span class="text-gradient">Simone Ferretti</span>
      </h1>
      <p id="cta"><span>web developer</span></p>
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
      background-color: #131313;
      color: #dddddd;
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
      font-size: 7rem;
      line-height: 1;
      text-align: center;
      margin-bottom: 1em;
      text-wrap: nowrap;
	}

	#cta {
      font-size: 4rem;
      position: absolute;
      right: 0;
      font-weight: 200;
      color: grey;
      top: 6rem;
	}

	.text-gradient {
      background-image: linear-gradient(45deg,rgb(136, 136, 136), rgb(230, 250, 250) 30%, rgb(255, 255, 255) 60% );
      background-clip: text;
      color: transparent;
	}

  </style>
  `);

	const fontFiles = [
		readFileSync(`${process.cwd()}/public/static/Inter_18pt-Light.ttf`),
		readFileSync(`${process.cwd()}/public/static/Inter_18pt-SemiBold.ttf`),
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

	return new Response(svg, {
		status: 200,
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	});
}
