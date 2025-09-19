// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const askAi=async(req,res)=> {
//   const {query}=req.body
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

//   const prompt = query;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     return text;
//   } catch (error) {
//     console.error("Error generating content:", error);
//     throw new Error("Failed to get a response from Gemini.");
//   }
// }



