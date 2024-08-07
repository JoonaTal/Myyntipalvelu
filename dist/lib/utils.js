"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatPrice = formatPrice;
exports.constructMetadata = constructMetadata;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function formatPrice(price, options = {}) {
    const { currency = 'USD', notation = 'compact' } = options;
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation,
        maximumFractionDigits: 2,
    }).format(numericPrice);
}
function constructMetadata({ title = 'Koulu Projekti tuote-kauppa', description = 'Koulu Projekti tuote-kauppa', image = '/thumbnail.png', icons = '/favicon.ico', noIndex = false, } = {}) {
    return Object.assign({ title,
        description, openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        }, twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@JoonaTalkara',
        }, icons, metadataBase: new URL('https://myyntipalvelu.up.railway.app') }, (noIndex && {
        robots: {
            index: false,
            follow: false,
        },
    }));
}
