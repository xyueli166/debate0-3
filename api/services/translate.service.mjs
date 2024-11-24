import fetch from 'node-fetch';

// Function to perform translation
export async function translateText(text, targetLang) {
  try {
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATE_KEY,
        'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATE_REGION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`Translation API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// API route handler
export async function handleTranslateRequest(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, targetLang } = req.body;
  
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Both text and targetLang are required' });
  }

  try {
    const translatedText = await translateText(text, targetLang);
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
