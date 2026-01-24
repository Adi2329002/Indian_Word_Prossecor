export const translateText = async (
  text: string,
  source: string,
  target: string
): Promise<string> => {
  try {
    // Using Google Translate's unofficial free endpoint
    // sl = source language, tl = target language, q = query text
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Translation API request failed with status ${res.status}`);
    }

    const data = await res.json();
    
    // Google returns a nested array. The translation is at data[0][0][0]
    return data[0][0][0]; 

  } catch (error) {
    console.error("Translation failed:", error);
    throw error;
  }
};