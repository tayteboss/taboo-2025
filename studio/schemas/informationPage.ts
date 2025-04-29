import {mediaBlock} from '../objects'

export default {
  title: 'Information Page',
  name: 'informationPage',
  type: 'document',
  fields: [
    {
      title: 'Reference Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
    },
    {
      title: 'SEO title',
      name: 'seoTitle',
      type: 'string',
    },
    {
      title: 'SEO Description',
      name: 'seoDescription',
      type: 'string',
    },
    {
      title: 'About Us Section',
      name: 'aboutUsSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Description',
          name: 'description',
          type: 'array',
          of: [
            {
              title: 'Block',
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],

              lists: [],
              marks: {
                decorators: [{title: 'Strong', value: 'strong'}],
                annotations: [],
              },
            },
          ],
        },
        {
          title: 'Subtitle',
          name: 'subtitle',
          type: 'string',
        },
      ],
    },
    {
      title: 'Statistics Section',
      name: 'statisticsSection',
      type: 'object',
      fields: [
        {
          title: 'Media Background',
          name: 'mediaBackground',
          type: 'object',
          fields: mediaBlock,
        },
        {
          title: 'Statistics',
          name: 'statistics',
          type: 'array',
          description: 'Maximum of 4 statistics.',
          of: [
            {
              title: 'Statistic',
              name: 'statistic',
              type: 'object',
              fields: [
                {
                  title: 'Value',
                  name: 'value',
                  type: 'string',
                },
                {
                  title: 'Title',
                  name: 'title',
                  type: 'string',
                },
              ],
            },
          ],
          validation: (Rule: any) => Rule.max(4),
        },
      ],
    },
    {
      title: 'Our Principles Section',
      name: 'principlesSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Description',
          name: 'description',
          type: 'array',
          of: [
            {
              title: 'Block',
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],

              lists: [],
              marks: {
                decorators: [{title: 'Strong', value: 'strong'}],
                annotations: [],
              },
            },
          ],
        },
        {
          title: 'Subtitle',
          name: 'subtitle',
          type: 'string',
        },
        {
          title: 'List',
          name: 'list',
          type: 'array',
          of: [
            {
              title: 'List Item',
              name: 'listItem',
              type: 'object',
              fields: [
                {
                  title: 'Title',
                  name: 'title',
                  type: 'string',
                },
                {
                  title: 'Description',
                  name: 'description',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Our Achievements Section',
      name: 'achievementsSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Description',
          name: 'description',
          type: 'string',
        },
        {
          title: 'Subtitle',
          name: 'subtitle',
          type: 'string',
        },
        {
          title: 'List',
          name: 'list',
          type: 'array',
          of: [
            {
              title: 'List Item',
              name: 'listItem',
              type: 'object',
              fields: [
                {
                  title: 'Name',
                  name: 'name',
                  type: 'string',
                },
                {
                  title: 'Nominations',
                  name: 'nominations',
                  type: 'string',
                },
                {
                  title: 'Year',
                  name: 'year',
                  type: 'string',
                },
                {
                  title: 'Optional Link',
                  name: 'optionalLink',
                  type: 'url',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Team Section',
      name: 'teamSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Team Members',
          name: 'teamMembers',
          type: 'array',
          of: [
            {
              title: 'Team Member',
              name: 'teamMember',
              type: 'object',
              fields: [
                {
                  title: 'Image',
                  name: 'image',
                  type: 'image',
                },
                {
                  title: 'Hover Media',
                  name: 'hoverMedia',
                  type: 'object',
                  fields: mediaBlock,
                  description:
                    'This media will be used on hover and on internal card. Use a video for the best results.',
                },
                {
                  title: 'Name',
                  name: 'name',
                  type: 'string',
                },
                {
                  title: 'Position',
                  name: 'position',
                  type: 'string',
                },
                {
                  title: 'description',
                  name: 'description',
                  type: 'text',
                },
                {
                  title: 'Social Links',
                  name: 'socialLinks',
                  type: 'array',
                  of: [
                    {
                      title: 'Social Link',
                      name: 'socialLink',
                      type: 'object',
                      fields: [
                        {
                          title: 'Title',
                          name: 'title',
                          type: 'string',
                        },
                        {
                          title: 'Link',
                          name: 'link',
                          type: 'url',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'How Do We Do It Section',
      name: 'howDoWeDoItSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'List',
          name: 'list',
          type: 'array',
          description: 'Works best with 4 items.',
          of: [
            {
              title: 'Item',
              name: 'item',
              type: 'object',
              fields: [
                {
                  title: 'Title',
                  name: 'title',
                  type: 'string',
                },
                {
                  title: 'List',
                  name: 'itemList',
                  type: 'array',
                  of: [
                    {
                      title: 'Item',
                      name: 'item',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Featured Client Logos Section',
      name: 'featuredClientLogosSection',
      type: 'object',
      fields: [
        {
          title: 'Logos',
          name: 'logos',
          type: 'array',
          of: [
            {
              title: 'Logo',
              name: 'logoItem',
              type: 'object',
              fields: [
                {
                  title: 'Title',
                  name: 'title',
                  type: 'string',
                },
                {
                  title: 'Image',
                  name: 'image',
                  type: 'image',
                },
                {
                  title: 'Link',
                  name: 'link',
                  type: 'url',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
