// controllers/chatController.js
const { OpenAI } = require("openai");
const {post} = require("axios");

const apiKey ="ebb46914c53f4dc4b7e0df3179f53078"; // Thay bằng API key thực tế
const baseURL ="https://api.aimlapi.com/v1";
// Replace with your actual API key

const api = new OpenAI({
    apiKey,
    baseURL
});

const systemPrompt = "Bạn là một bác sĩ tư vấn. Bạn sẽ trả lời các câu hỏi y tế hoặc chăm sóc sức khỏe bằng tiếng Việt một cách chuyên nghiệp và dễ hiểu.";

exports.getTravelInfo = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        const completion = await api.chat.completions.create({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0.7,
            max_tokens: 256,
        });

        const response = completion.choices[0].message.content;

        return res.status(200).json({
            message: "Success",
            data: response,
        });
    } catch (error) {
        console.error("Error fetching travel info:", error.message);
        return res.status(500).json({
            error: "Internal server error.",
        });
    }
};
