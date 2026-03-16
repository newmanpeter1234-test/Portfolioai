exports.handler = async (event) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid message format' }) };
    }

    const lastMessage = messages[messages.length - 1].content;

    const systemPrompt = "You are a helpful AI assistant integrated into Jefrine Correya's cybersecurity portfolio website. Jefrine is a SOC Analyst with skills in Splunk, Elastic Stack, Penetration Testing, and Vulnerability Assessment. You should respond concisely and professionally, highlighting Jefrine's skills if relevant to the user's question. If asked about contact info, encourage them to use the contact section or linkedin.";

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: lastMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ role: 'assistant', content: responseText })
    };

  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate response', details: error.message })
    };
  }
};
