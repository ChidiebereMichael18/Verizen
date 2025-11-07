// const Groq = require('groq-sdk');
// const { GROQ_API_KEY } = require('../../config');

// const groq = new Groq({ apiKey: GROQ_API_KEY });

// async function generateResponse(prompt, history = []) {
//   try {
//     const messages = [
//       {
//         role: "system",
//         content: `You are VeriZen AI, a helpful and empathetic customer service agent for a fintech company. Your goal is to:
// 1. Understand the user's issue or complaint clearly.
// 2. Ask for any crucial missing information (like transaction ID, amount, date) in a friendly way.
// 3. Provide a helpful, accurate, and concise response.
// 4. If you cannot resolve the issue, assure the user that a human agent will review it shortly.

// Be professional yet warm. Use the user's language.`
//       },
//       ...history,
//       { role: "user", content: prompt }
//     ];

//     const completion = await groq.chat.completions.create({
//       messages: messages,
//       model: "llama3-70b-8192",
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.error('Groq API Error:', error);
//     throw new Error('Failed to get AI response from Groq');
//   }
// }

// module.exports = { generateResponse };