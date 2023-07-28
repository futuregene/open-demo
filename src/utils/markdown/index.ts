import MarkdownIt from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import './style.less'

export const md = new MarkdownIt({
  linkify: true,
})

md.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
