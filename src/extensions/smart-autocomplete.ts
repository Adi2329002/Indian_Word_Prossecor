import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const SmartAutocomplete = Extension.create({
  name: 'smartAutocomplete',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('smartAutocomplete'),
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, oldSet) {
            const { selection, doc } = tr.doc.type.create(tr.doc.content).resolve(0).parent.type.createAndFill() ? tr : { selection: tr.selection, doc: tr.doc }
            
            // 1. Get current word being typed
            const { $from } = selection
            const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 20), $from.parentOffset, '\n', '\ufffc')
            const match = textBefore.match(/(\w{3,})$/) // Match last 3+ letters
            
            if (!match) return DecorationSet.empty

            const query = match[0].toLowerCase()
            
            // 2. Scan entire doc for words starting with this query
            const allText = doc.textBetween(0, doc.content.size, ' ')
            const words = allText.split(/\s+/)
            
            // Find a candidate that is NOT the word we are currently typing
            const candidate = words.find(w => 
              w.toLowerCase().startsWith(query) && 
              w.toLowerCase() !== query && 
              w.length > query.length
            )

            if (!candidate) return DecorationSet.empty

            // 3. Show "Ghost Text" suggestion
            const suggestion = candidate.slice(query.length)
            
            const decoration = Decoration.widget($from.pos, () => {
              const span = document.createElement('span')
              span.textContent = suggestion
              span.style.color = '#ccc' // Grey text
              span.style.pointerEvents = 'none'
              return span
            }, { side: 1 })

            return DecorationSet.create(tr.doc, [decoration])
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
          handleKeyDown(view, event) {
            if (event.key === 'Tab') {
              const { state } = view
              const { selection } = state
              
              // If we have a suggestion, Tab accepts it
              const decoSet = this.getState(state)
              if (decoSet && decoSet.find(selection.from, selection.to).length > 0) {
                const widget = decoSet.find(selection.from, selection.to)[0]
                // @ts-ignore - Accessing internal widget spec
                const suggestionText = widget.type.toDOM.textContent
                
                if (suggestionText) {
                  view.dispatch(state.tr.insertText(suggestionText))
                  event.preventDefault()
                  return true
                }
              }
            }
            return false
          }
        }
      })
    ]
  },
})