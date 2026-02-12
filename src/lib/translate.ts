"use server";

export const translateText = async (text: string, source: string, target: string): Promise<string> => {
  if (!text.trim()) return "";

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        // Masquerading as a browser helps prevent 429 errors
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 3600 } // Cache results for 1 hour to save hits
    });

    if (res.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    if (!res.ok) throw new Error("API_FAILURE");

    const data = await res.json();
    return data[0].map((part: any) => part[0]).join("");
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};