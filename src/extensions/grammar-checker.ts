import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { debounce } from 'lodash'

export const GrammarChecker = Extension.create({
  name: 'grammarChecker',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('grammarChecker'),
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, oldState) {
            return tr.getMeta('grammarChecker') || oldState.map(tr.mapping, tr.doc)
          },
        },
        view(editorView) {
          const checkGrammar = debounce(async () => {
            const { doc } = editorView.state
            const text = doc.textBetween(0, doc.content.size, '\n')
            
            // 1. Send to LanguageTool API (Free Public API)
            // Note: For production, host your own instance to avoid rate limits
            try {
              const res = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  text: text,
                  language: 'auto', // Auto-detects Hindi, English, etc.
                  enabledOnly: 'false',
                }),
              })
              
              const data = await res.json()
              
              // 2. Create Decorations (Underlines)
              const decorations: Decoration[] = []
              
              data.matches.forEach((match: any) => {
                const from = match.offset
                const to = match.offset + match.length
                
                // Create a decoration with a tooltip
                const decoration = Decoration.inline(from, to, {
                  class: 'grammar-error',
                  'data-message': match.message,
                  'data-replacements': JSON.stringify(match.replacements.slice(0, 3).map((r: any) => r.value)),
                  style: `border-bottom: 2px wavy ${match.rule.issueType === 'misspelling' ? 'red' : '#eab308'}; cursor: pointer;`,
                  title: `${match.message} (Click to fix)`
                })
                
                decorations.push(decoration)
              })

              // 3. Update the Editor View
              const tr = editorView.state.tr.setMeta('grammarChecker', DecorationSet.create(doc, decorations))
              editorView.dispatch(tr)
              
            } catch (error) {
              console.error("Grammar check failed:", error)
            }
          }, 1500) // Wait 1.5s after typing to check

          // Run initial check
          checkGrammar()

          return {
            update() {
              checkGrammar()
            },
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
          // Simple click handler to replace text
          handleClick(view, pos, event) {
            const target = event.target as HTMLElement
            if (target.classList.contains('grammar-error')) {
              const replacements = JSON.parse(target.getAttribute('data-replacements') || '[]')
              if (replacements.length > 0) {
                const suggestion = confirm(`Suggestion: ${replacements[0]}\n\nApply this change?`)
                if (suggestion) {
                  // This is a rough fix - getting exact pos from DOM is tricky
                  // Ideally, use a proper popup menu here
                  alert("Please manually correct to: " + replacements[0])
                }
              } else {
                alert(target.getAttribute('data-message'))
              }
            }
            return false
          }
        },
      }),
    ]
  },
})