import MarkdownIt from 'markdown-it'
import MILA from 'markdown-it-link-attributes'
import './style.less'

export const md = new MarkdownIt({
  linkify: true,
})

md.use(MILA, { attrs: { target: '_blank', rel: 'noopener' } })
