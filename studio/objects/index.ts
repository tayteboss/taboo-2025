const selectMediaTypeObject = {
  title: 'Select Media Type',
  name: 'mediaType',
  type: 'string',
  options: {
    list: [
      {title: 'Image', value: 'image'},
      {title: 'Video', value: 'video'},
    ],
    layout: 'dropdown',
  },
}

const ratioList = [
  {title: '1:1 - Square', value: '100%'},
  {title: '4:5 - Portrait', value: '125%'},
  {title: '3:2 - Landscape', value: '66.66%'},
  {title: '16:9 - Film', value: '56.25%'},
]

const seoObject = {
  title: 'SEO',
  name: 'seo',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'SEO Title',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Meta Description',
      rows: 3,
    },
  ],
}

const imageObject = {
  title: 'Image',
  name: 'image',
  type: 'image',
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
    },
  ],
  options: {
    collapsible: false,
    collapsed: false,
  },
}

const videoObject = {
  title: 'Video',
  name: 'video',
  type: 'mux.video',
  options: {
    collapsible: false,
    collapsed: false,
  },
}

const multiTypeBlock = {
  type: 'object',
  fields: [
    {
      title: 'Text',
      name: 'text',
      type: 'string',
      description: 'Spaces will be automatically be prefixed and suffixed.',
    },
    {
      title: 'Font Style',
      name: 'fontStyle',
      type: 'string',
      options: {
        list: [
          {title: 'Serif', value: 'serif'},
          {title: 'All Caps', value: 'allCaps'},
        ],
        layout: 'radio',
      },
      initialValue: 'serif',
    },
  ],
}

const mediaBlock = [
  {
    title: 'Media',
    name: 'media',
    type: 'object',
    fields: [
      selectMediaTypeObject,
      {
        ...imageObject,
        hidden: ({parent}: any) => parent?.mediaType !== 'image',
      },
      {
        ...videoObject,
        hidden: ({parent}: any) => parent?.mediaType !== 'video',
      },
    ],
  },
]

const columnFields = [
  {
    title: 'Select Block Type',
    name: 'blockType',
    type: 'string',
    options: {
      list: [
        {title: 'Media Block', value: 'media'},
        {title: 'Content Block', value: 'content'},
        {title: 'Statistic Block', value: 'statistic'},
      ],
      layout: 'dropdown',
    },
    initialValue: 'media',
  },
  {
    title: 'Content Block',
    name: 'contentBlock',
    type: 'array',
    of: [
      {
        title: 'Content Block Item',
        name: 'contentBlockItem',
        type: 'object',
        fields: [
          {
            title: 'Title',
            name: 'title',
            type: 'string',
          },
          {
            title: 'Text',
            name: 'text',
            type: 'text',
          },
        ],
      },
    ],
    hidden: ({parent}: any) => parent?.blockType !== 'content',
  },
  {
    title: 'Media Block',
    name: 'media',
    type: 'object',
    fields: [
      selectMediaTypeObject,
      {
        ...imageObject,
        hidden: ({parent}: any) => parent?.mediaType !== 'image',
      },
      {
        ...videoObject,
        hidden: ({parent}: any) => parent?.mediaType !== 'video',
      },
    ],
    hidden: ({parent}: any) => parent?.blockType !== 'media',
  },
  {
    title: 'Statistic Block',
    name: 'statisticBlock',
    type: 'array',
    description: 'Please use 1 to 3 statistic blocks',
    of: [
      {
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
    hidden: ({parent}: {parent: any}) => parent?.blockType !== 'statistic',
  },
]

const fullMedia = {
  name: 'fullMedia',
  title: 'Full Media',
  type: 'object',
  fields: [
    {
      title: 'Ratio',
      name: 'ratio',
      type: 'string',
      options: {
        list: ratioList,
      },
    },
    {
      title: 'Caption',
      name: 'caption',
      type: 'string',
      description: 'Optional caption',
    },
    {
      title: 'Media',
      name: 'media',
      type: 'object',
      fields: [
        selectMediaTypeObject,
        {
          ...imageObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'image',
        },
        {
          ...videoObject,
          hidden: ({parent}: any) => parent?.mediaType !== 'video',
        },
      ],
    },
  ],
  hidden: ({parent}: {parent: any}) => parent?.component !== 'fullMedia',
}

const twoColumn = {
  name: 'twoColumn',
  title: 'Two Column',
  type: 'object',
  fields: [
    {
      title: 'Ratio',
      name: 'ratio',
      type: 'string',
      options: {
        list: [
          {title: '1:1 - Square', value: '100%'},
          {title: '4:5 - Portrait', value: '125%'},
          {title: '3:2 - Landscape', value: '66.66%'},
        ],
      },
    },
    {
      title: 'Left Column',
      name: 'leftColumn',
      type: 'object',
      fields: columnFields,
    },
    {
      title: 'Right Column',
      name: 'rightColumn',
      type: 'object',
      fields: columnFields,
    },
  ],
  hidden: ({parent}: {parent: any}) => parent?.component !== 'twoColumn',
}

const statisticBlock = {
  name: 'statisticBlock',
  title: 'Statistic Block',
  type: 'array',
  description: 'Please use 1 to 3 statistic blocks',
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
  hidden: ({parent}: {parent: any}) => parent?.component !== 'statisticBlock',
}

export {
  multiTypeBlock,
  mediaBlock,
  imageObject,
  videoObject,
  selectMediaTypeObject,
  seoObject,
  fullMedia,
  twoColumn,
  ratioList,
  statisticBlock,
}
