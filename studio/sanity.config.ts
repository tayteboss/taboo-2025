import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {muxInput} from 'sanity-plugin-mux-input'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {EarthGlobeIcon, DocumentIcon, CaseIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'Taboo Full',

  projectId: 'e1i1kimz',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .icon(EarthGlobeIcon)
              .child(S.editor().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Home Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Information Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('informationPage').documentId('informationPage')),
            S.listItem()
              .title('Work Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('workPage').documentId('workPage')),
            S.divider(),
            S.listItem()
              .title('Project')
              .icon(CaseIcon)
              .child(
                S.documentList()
                  .title('Project')
                  .schemaType('project')
                  .filter('_type == "project"'),
              ),
            S.divider(),
            S.listItem()
              .title('Client')
              .icon(CaseIcon)
              .child(
                S.documentList().title('Client').schemaType('client').filter('_type == "client"'),
              ),
            S.divider(),
            orderableDocumentListDeskItem({type: 'project', S, context}),
          ])
      },
    }),
    visionTool(),
    muxInput({mp4_support: 'standard', max_resolution_tier: '2160p'}),
    vercelDeployTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  parts: [
    {
      name: 'part:@sanity/base/theme/variables-style',
      path: './customEditorStyles.css',
    },
  ],
})
