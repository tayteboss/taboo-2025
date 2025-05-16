const sanityClient = require('@sanity/client');
const fs = require('fs');

const client = sanityClient.createClient({
    projectId: 'e1i1kimz',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-04-15',
});

const getSiteData = async () => {
    const query = `
        *[_type == 'siteSettings'][0] {
            ...,
            socialLinks[] {
                title,
                link
            },
            contactEmail,
            contactPhone,
            address,
            addressUrl,
            footerMedia[] {
                ...,
                asset-> {
                    url,
                },
            },
            personalContacts[] {
                name,
                role,
                email,
                media {
				    media {
                        ...,
                        mediaType,
                        image {
                            asset-> {
                                url,
                                metadata {
                                    lqip,
                                    dimensions {
                                        aspectRatio,
                                    },
                                },
                            },
                            alt
                        },
                        video {
                            asset-> {
                                playbackId,
                            },
                        },
                    }
                }
            },
            backToTopButtonTitle
        }
    `;

    try {
        const data = await client.fetch(query);
        const path = 'json';
        const file = 'siteSettings.json';
        const jsonData = JSON.stringify(data);

        fs.writeFile(`${path}/${file}`, jsonData, 'utf8', () => {
            console.log(`Wrote ${file} file.`);
        });

        return data;
    } catch (error) {
        console.error('Error fetching site data:', error);
        return [];
    }
};

module.exports = {
    getSiteData,
};
