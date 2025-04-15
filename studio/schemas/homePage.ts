import {mediaBlock} from '../objects'

export default {
  title: 'Home Page',
  name: 'homePage',
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
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Use Project Reference',
              name: 'useProjectReference',
              type: 'boolean',
            },
            {
              title: 'Project',
              name: 'project',
              type: 'reference',
              to: [{type: 'project'}],
              hidden: ({parent}: any) => !parent?.useProjectReference,
            },
            {
              title: 'Free Media',
              name: 'media',
              type: 'object',
              fields: mediaBlock,
              hidden: ({parent}: any) => parent?.useProjectReference,
            },
            {
              title: 'Title',
              name: 'title',
              type: 'string',
              hidden: ({parent}: any) => parent?.useProjectReference,
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text',
              rows: 3,
              hidden: ({parent}: any) => parent?.useProjectReference,
            },
            {
              title: 'Link',
              name: 'link',
              type: 'url',
              description: 'Optional link',
              hidden: ({parent}: any) => parent?.useProjectReference,
            },
          ],
        },
      ],
    },
  ],
}
