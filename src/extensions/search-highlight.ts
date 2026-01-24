import { Extension } from "@tiptap/core"
import { Plugin } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

export const SearchHighlight = Extension.create({
  name: "searchHighlight",

  addOptions() {
    return {
      searchTerm: "",
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state
            const decorations: Decoration[] = []
            const search = this.options.searchTerm

            if (!search) return null

            const searchLower = search.toLowerCase()

            doc.descendants((node: any, pos: number) => {
              if (!node.isText || !node.text) return

              const text = node.text.toLowerCase()
              let index = 0

              while ((index = text.indexOf(searchLower, index)) !== -1) {
                decorations.push(
                  Decoration.inline(
                    pos + index,
                    pos + index + search.length,
                    { class: "search-highlight" }
                  )
                )
                index += search.length
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
