import {CaseIcon} from '@sanity/icons'
import {fullMedia, mediaBlock, ratioList, statisticBlock, twoColumn} from '../objects'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  title: 'Project',
  name: 'project',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'project'}),
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
        slugify: (input: any) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      title: 'Client',
      name: 'client',
      type: 'reference',
      to: [{type: 'client'}],
    },
    {
      title: 'Services',
      name: 'services',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Foresight', value: 'foresight'},
              {title: 'Advertising', value: 'advertising'},
              {title: 'Design', value: 'design'},
              {title: 'Experiential', value: 'experiential'},
            ],
            layout: 'checkbox',
          },
        },
      ],
    },
    {
      title: 'Grid Thumbnail Media',
      name: 'gridThumbnailMedia',
      type: 'object',
      fields: mediaBlock,
    },
    {
      title: 'Grid Thumbnail Ratio',
      name: 'gridThumbnailRatio',
      type: 'string',
      options: {
        list: ratioList,
      },
    },
    {
      title: 'Overview Description',
      name: 'overviewDescription',
      type: 'text',
      rows: 5,
    },
    {
      title: 'Overview statistics',
      name: 'overviewStatistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Value',
              name: 'value',
              type: 'string',
            },
            {
              title: 'Description',
              name: 'description',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      title: 'Hero media',
      name: 'heroMedia',
      type: 'object',
      fields: mediaBlock,
      description: 'First block on project page, landscape media has best results.',
    },
    {
      title: 'Page Builder',
      name: 'pageBuilder',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: {
            select: {
              component: 'component',
            },
            prepare: ({component}: any) => {
              let componentName = ''

              if (component === 'fullMedia') {
                componentName = 'Full Media'
              } else if (component === 'twoColumn') {
                componentName = 'Two Column'
              } else if (component === 'statisticBlock') {
                componentName = 'Statistic Block'
              } else {
                componentName = 'Unknown'
              }

              return {
                title: componentName,
              }
            },
          },
          fields: [
            {
              title: 'Select Media Component',
              name: 'component',
              type: 'string',
              options: {
                list: [
                  {title: 'Full Media', value: 'fullMedia'},
                  {title: 'Two Column', value: 'twoColumn'},
                  {title: 'Statistic Block', value: 'statisticBlock'},
                ],
                layout: 'dropdown',
              },
            },
            fullMedia,
            twoColumn,
            statisticBlock,
          ],
        },
      ],
    },
  ],
}
