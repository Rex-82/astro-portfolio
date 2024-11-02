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
            "Full-Stack Web Developer passionate about React, JavaScript, Node.js, Rust, Go, TypeScript, and SQL. Crafting web applications and CLI tools.",
        start_url: "/",
        display: "standalone",
        id: "some-unique-id",
        icons,
    };

    return new Response(JSON.stringify(manifest));
};
