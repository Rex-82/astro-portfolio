import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import favicon from "../../public/assets/favicon/favicon.png";

const faviconPngSizes = [192, 512];

export const GET: APIRoute = async () => {
    const icons = await Promise.all(
        faviconPngSizes.map(async (size) => {
            const image = await getImage({
                src: favicon,
                width: size,
                height: size,
                format: "png",
            });
            return {
                src: image.src,
                type: `image/${image.options.format}`,
                sizes: `${image.options.width}x${image.options.height}`,
            };
        }),
    );

    const manifest = {
        name: "Simone Ferretti",
        description:
            "Full-Stack Developer building agentic systems and the infrastructure they need to not fall over. TypeScript, Next.js, NestJS, PostgreSQL.",
        start_url: "/",
        display: "standalone",
        id: "https://simoneferretti.dev/",
        icons,
    };

    return new Response(JSON.stringify(manifest));
};
