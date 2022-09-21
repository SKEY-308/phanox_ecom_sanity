import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    dataset: 'production',
    projectId: '1t7d4lyi',
    apiVersion: '2022-09-16',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);