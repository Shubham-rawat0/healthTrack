// import { Inngest } from "inngest";
// export const inngest = new Inngest({
//   id: "my-app",
// });

// import { sendMail } from "../utils/sendmail.js";
// import { agent } from "../utils/ai.js";


// const askAiFn = inngest.createFunction(
//   { id: "ask-ai" },
//   { event: "ai/askai" },
//   async ({ event }) => {
//     const { query } = event.data;

//     try {
//       console.log("Processing AI query:", query);
//       console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);

//       const aiRes = await agent.run(query);
//       console.log(
//         "AI Response structure:",
//         typeof aiRes,
//         Object.keys(aiRes || {})
//       );

//       let answer;
//       if (aiRes?.output_text) {
//         answer = aiRes.output_text;
//       } else if (aiRes?.text) {
//         answer = aiRes.text;
//       } else if (aiRes?.content) {
//         answer = aiRes.content;
//       } else if (typeof aiRes === "string") {
//         answer = aiRes;
//       } else {
//         console.log("Full AI response:", JSON.stringify(aiRes, null, 2));
//         return {
//           answer:
//             "Sorry, I couldn't generate a valid answer. Please try rephrasing your query.",
//           debug: { responseStructure: Object.keys(aiRes || {}) },
//         };
//       }

//       console.log("Successfully processed query");
//       return { answer };
//     } catch (err) {
//       console.error("AI Agent error:", err);
//       console.error("Error stack:", err.stack);

//       // More specific error handling
//       if (err.message.includes("API key")) {
//         return {
//           answer: "API configuration error. Please check the API key.",
//           error: "Invalid API key",
//         };
//       } else if (err.message.includes("403")) {
//         return {
//           answer: "Access forbidden. Please check your API permissions.",
//           error: "403 Forbidden",
//         };
//       } else if (err.message.includes("400")) {
//         return {
//           answer: "Bad request. Please check your query format.",
//           error: "400 Bad Request",
//         };
//       }

//       return {
//         answer:
//           "Something went wrong while processing your request. Please try again later.",
//         error: err.message,
//       };
//     }
//   }
// );

// const sendingMail = inngest.createFunction(
//   { id: "send-mail" },
//   { event: "api/sendmail" },
//   async ({ event, step }) => {
//     const data = event.data;
//     try {
//       await step.run("sendingmail", async () => {
//         await sendMail(data.to, data.name);
//       });
//       return { status: "success", message: "Mail sent successfully" };
//     } catch (err) {
//       console.error("Error sending email:", err);
//       return { status: "failed", error: err.message };
//     }
//   }
// );

// export const functions = [askAiFn, sendingMail];
