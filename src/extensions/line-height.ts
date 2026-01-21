import { Extension } from "@tiptap/react"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeightExtension = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"], // Ensure these match your schema names
      defaultLineHeight: "normal",
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight || attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ state, tr, dispatch }) => {
        const { selection } = state
        tr = tr.setSelection(selection)

        const { from, to } = selection

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight,
            })
          }
        })

        if (dispatch) dispatch(tr)
        return true
      },

      unsetLineHeight: () => ({ state, tr, dispatch }) => {
        const { from, to } = state.selection
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight: this.options.defaultLineHeight,
            })
          }
        })
        if (dispatch) dispatch(tr)
        return true
      },
    }
  },
})