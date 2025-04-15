import {mediaBlock} from '../objects'

export default {
  title: 'Site Settings',
  name: 'siteSettings',
  type: 'document',
  fields: [
    {
      title: 'Reference Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
    },
    {
      title: 'Social Links',
      name: 'socialLinks',
      type: 'array',
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
              title: 'Link',
              name: 'link',
              type: 'url',
            },
          ],
        },
      ],
    },
    {
      title: 'Contact Email',
      name: 'contactEmail',
      type: 'string',
    },
    {
      title: 'Contact Phone',
      name: 'contactPhone',
      type: 'string',
    },
    {
      title: 'Address',
      name: 'address',
      type: 'text',
      rows: 3,
    },
    {
      title: 'Address URL',
      name: 'addressUrl',
      type: 'url',
    },
    {
      title: 'Personal Contacts',
      name: 'personalContacts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string',
            },
            {
              title: 'Role',
              name: 'role',
              type: 'string',
            },
            {
              title: 'Email',
              name: 'email',
              type: 'string',
            },
            {
              title: 'Image',
              name: 'image',
              type: 'image',
            },
          ],
        },
      ],
    },
    {
      title: 'Footer Media',
      name: 'footerMedia',
      type: 'array',
      of: [
        {
          title: 'Image',
          name: 'image',
          type: 'image',
        },
      ],
    },
  ],
}
