import { GoogleGenAI } from '@google/genai';
import ChatSession from '../models/ChatSession.js';
import Course from '../models/Course.js';

// Helper to get Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// @desc    Get chat history for a course
// @route   GET /api/chat/:courseId
// @access  Private
export const getChatHistory = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    let chatSession = await ChatSession.findOne({
      student: studentId,
      course: courseId,
    });

    if (!chatSession) {
      chatSession = await ChatSession.create({
        student: studentId,
        course: courseId,
        messages: [],
      });
    }

    res.json(chatSession.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message to the AI Chatbot
// @route   POST /api/chat/:courseId
// @access  Private
export const sendMessageToAI = async (req, res) => {
  const { courseId } = req.params;
  const { lessonId, message } = req.body;
  const studentId = req.user._id;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // 1. Fetch course & lesson details for context
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    const lessonTitle = lesson ? lesson.title : 'General Course Content';
    const lessonContent = lesson ? lesson.textContent : 'No reading material specified for this lesson.';

    // 2. Fetch or create chat session in DB
    let chatSession = await ChatSession.findOne({
      student: studentId,
      course: courseId,
    });

    if (!chatSession) {
      chatSession = new ChatSession({
        student: studentId,
        course: courseId,
        messages: [],
      });
    }

    // 3. Add user message to database history
    const userMessage = {
      role: 'user',
      parts: [{ text: message }],
      timestamp: new Date(),
    };
    chatSession.messages.push(userMessage);

    // 4. Check for Gemini API key and respond
    const ai = getGeminiClient();

    let aiReplyText = '';

    if (!ai) {
      // Graceful fallback for demo mode
      aiReplyText = `[DEMO MODE] Hi ${req.user.name}! I see you're asking about the lesson "**${lessonTitle}**". 

To unlock live AI responses powered by Gemini, please add a valid \`GEMINI_API_KEY\` to your \`backend/.env\` file.

Here is a simulated response based on the lesson details:
*   **Lesson studied**: ${lessonTitle}
*   **Your Question**: "${message}"
*   **What you should do next**: Review the lesson's video resource or read the text description below to learn more!`;
    } else {
      // Construct system instruction
      const systemInstruction = `You are a helpful and knowledgeable AI tutor inside an LMS. 
You are assisting the student "${req.user.name}" who is enrolled in the course "${course.title}".
The student is currently studying the lesson "${lessonTitle}".
Here is the lesson content:
---
${lessonContent}
---
Instructions:
- Answer the student's question accurately based on the lesson content and your general knowledge.
- If they ask for code, write clean, well-commented code.
- If they ask for explanations, explain it in an easy-to-understand way.
- Be encouraging and friendly.`;

      // Format previous chat history for the SDK (exclude timestamps, ensure correct format)
      // Note: We only send the last 15 messages to prevent context bloat
      const historyLimit = 15;
      const recentMessages = chatSession.messages.slice(-historyLimit);
      const formattedContents = recentMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }],
      }));

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
          },
        });

        if (response && response.text) {
          aiReplyText = response.text;
        } else {
          aiReplyText = "I received an empty response from the AI model. Please try again.";
        }
      } catch (geminiError) {
        console.error('Gemini API call failed:', geminiError);
        aiReplyText = `Sorry, the AI engine encountered an error: ${geminiError.message}`;
      }
    }

    // 5. Add AI response to database history
    const aiMessage = {
      role: 'model',
      parts: [{ text: aiReplyText }],
      timestamp: new Date(),
    };
    chatSession.messages.push(aiMessage);

    // Save chat session
    await chatSession.save();

    // Return the updated chat history (or just the new message & response)
    res.json(chatSession.messages);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear chat history for a course
// @route   DELETE /api/chat/:courseId
// @access  Private
export const clearChatHistory = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    const chatSession = await ChatSession.findOne({
      student: studentId,
      course: courseId,
    });

    if (chatSession) {
      chatSession.messages = [];
      await chatSession.save();
    }

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
