// src/extensions/indic-transliteration.ts
import { Extension } from '@tiptap/core'

export const IndicTransliteration = Extension.create({
  name: 'indicTransliteration',

  addKeyboardShortcuts() {
    return {
      // This runs every time you press SPACE
      Space: ({ editor }) => {
        const { selection, doc } = editor.state
        const { from } = selection

        // 1. Grab the last word you typed
        const textBefore = doc.textBetween(from - 30, from, '\n', ' ')
        const lastWord = textBefore.split(' ').pop()

        // If no word found, just let the space happen normally
        if (!lastWord || lastWord.trim().length === 0) return false 

        // 2. Send it to Google (Hinglish -> Hindi)
        // You can change 'hi-t-i0-und' to 'bn-t-i0-und' (Bengali), 'ta-t-i0-und' (Tamil), etc.
        fetch(`https://inputtools.google.com/request?text=${lastWord}&itc=hi-t-i0-und&num=1`)
          .then(res => res.json())
          .then(data => {
            // Google returns a list of suggestions. We take the first one.
            const hindiWord = data[1][0][1][0] 

            if (hindiWord) {
              editor.commands.command(({ tr, dispatch }) => {
                if (dispatch) {
                  // 3. Delete English word -> Insert Hindi word + Space
                  const start = from - lastWord.length
                  tr.insertText(hindiWord + ' ', start, from) 
                }
                return true
              })
            }
          })
          .catch(err => {
             // If internet fails, just do nothing (let the space act normal)
             console.error(err)
          })

        // Return false to let the space key act normally while waiting for the API
        return false 
      },
    }
  },
})