require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log('🔍 Testing available Gemini models...\n');
  
  const testModels = [
    'gemini-1.0-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest', 
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro-001'
  ];

  for (const modelName of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello" in one word.');
      console.log(`✅ ${modelName}: WORKING`);
    } catch (error) {
      console.log(`❌ ${modelName}: ${error.message.split('\n')[0]}`);
    }
  }
}

testModels();