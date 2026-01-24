import { Extension } from '@tiptap/core'
import { useLanguageStore } from '@/store/use-language-store'

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

        const { language } = useLanguageStore.getState()
        
        // Safety: If language is English, don't try to transliterate
        if (language.code === 'en') return false;

        const itc = `${language.code}-t-i0-und`

        // 2. Send it to Google
        fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(lastWord)}&itc=${itc}&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`)
          .then(res => res.json())
          .then(data => {
            // 👇 THE FIX: Check if data exists before grabbing it
            if (
              data && 
              data[0] === 'SUCCESS' && 
              data[1] && 
              data[1][0] && 
              data[1][0][1] && 
              data[1][0][1].length > 0
            ) {
              const transliteratedWord = data[1][0][1][0]

              editor.commands.command(({ tr, dispatch }) => {
                if (dispatch) {
                  // 3. Delete English word -> Insert transliterated word + Space
                  const start = from - lastWord.length
                  tr.insertText(transliteratedWord + ' ', start, from) 
                }
                return true
              })
            }
          })
          .catch(err => {
             console.error("Transliteration skipped:", err)
          })

        // Return false to let the space key act normally while waiting for the API
        return false 
      },
    }
  },
})