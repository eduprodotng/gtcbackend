const {
  saveFinancialInquiry,
  getInquiriesByUser,
  getInquiriesFromLast7Days,
  getChatSessionsByUser,
  getInquiriesFromDateRange,
  archiveAllForUser,
  getInquiriesByChatIdModel,
  deleteAllInquiriesForUser,
  getMessagesByChatId,
} = require("../models/FinIn");
const { saveInquiry, getInquiryByUser } = require("../models/Inquiry");
const { saveExpense, getExpenseByUser } = require("../models/Expense");
const { saveCredit, getCreditByUser } = require("../models/Credit");
const { saveBuy, getBuyByUser } = require("../models/Buy");
const { saveDefi, getDefiByUser } = require("../models/Defi");
const { saveEd, getEdByUser } = require("../models/Ed");
const { saveGoal, getGoalByUser } = require("../models/Goal");
const { saveBusiness, getBusinessByUser } = require("../models/Business");
const { saveInvestment, getInvestmentByUser } = require("../models/Investment");
const { saveLoan, getLoanByUser } = require("../models/Loan");
const { saveBudget, getBudgetByUser } = require("../models/Budget");
const { saveAnalysis, getAnalysisByUser } = require("../models/Analysis");
const { saveBnpl, getBnplByUser } = require("../models/Bnpl");
const jwt = require("jsonwebtoken");
const { extractTextFromImageWithTextract } = require("../utils/textract"); // update path as needed

const { getAIResponse } = require("../services/aiService");
const { getInquiryAIResponse } = require("../services/inquiryService");
const { getbudgetAIResponse } = require("../services/budgetService");
const { getanalysisAIResponse } = require("../services/analysisService");
const { getgoalAIResponse } = require("../services/goalService");
const { getcreditAIResponse } = require("../services/creditService");
const { getloanAIResponse } = require("../services/loanService");
const { getbnplAIResponse } = require("../services/bnplService");
const { getbuyAIResponse } = require("../services/buyService");
const { getinvestmentAIResponse } = require("../services/investmentService");
const { getdefiAIResponse } = require("../services/defiService");
const { getedAIResponse } = require("../services/edService");
const { getbusinessAIResponse } = require("../services/businessService");
const { getexpenseAIResponse } = require("../services/expenseService");
const path = require("path");
const fs = require("fs");
const { extractTextFromPDF } = require("../utils/pdfUtils");
const { createWorker } = require("tesseract.js");
const Tesseract = require("tesseract.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const createFinancialInquiry = async (req, res) => {
//   try {
//     const { chatTitle, chatId, userMessage } = req.body;
//     const userId = req.user.id;

//     if (!userMessage && !req.file) {
//       return res
//         .status(400)
//         .json({ error: "Please provide a message or a file." });
//     }

//     let finalMessage = userMessage || "";
//     let fileUrl = null;

//     if (req.file) {
//       fileUrl = req.file.location; // ✅ This is the S3 file URL

//       const mime = req.file.mimetype;

//       if (mime === "application/pdf") {
//         // --- PDF processing ---
//         const tempFilePath = `/tmp/${Date.now()}-${req.file.originalname}`;
//         const fs = require("fs");
//         const { default: fetch } = await import("node-fetch");

//         const response = await fetch(fileUrl);
//         const buffer = await response.buffer();
//         fs.writeFileSync(tempFilePath, buffer);

//         const textContent = await extractTextFromPDF(tempFilePath);
//         finalMessage += `\n\nSummarize this PDF:\n${textContent}`;

//         fs.unlinkSync(tempFilePath); // cleanup
//       }

//       // 🆕 Add OCR logic for image files
//       else if (mime.startsWith("image/")) {
//         const tempImagePath = `/tmp/${Date.now()}-${req.file.originalname}`;
//         const fs = require("fs");
//         const { default: fetch } = await import("node-fetch");

//         const response = await fetch(fileUrl);
//         const buffer = await response.buffer();
//         fs.writeFileSync(tempImagePath, buffer);

//         const {
//           data: { text },
//         } = await Tesseract.recognize(tempImagePath, "eng");
//         finalMessage += `\n\nExtracted Text from Image:\n${text}`;

//         fs.unlinkSync(tempImagePath); // cleanup
//       }
//     }

//     const aiResponse = await getAIResponse(finalMessage);

//     const inquiry = await saveFinancialInquiry({
//       userId,
//       chatTitle,
//       chatId,
//       userMessage: finalMessage,
//       aiResponse,
//       fileUrl,
//     });

//     res.status(201).json({
//       status: "success",
//       message: "Inquiry processed and saved",
//       data: inquiry,
//     });
//   } catch (err) {
//     console.error("Error creating inquiry:", err);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error.",
//     });
//   }
// };

// Optional: Fetch user inquiries

// const createFinancialInquiry = async (req, res) => {
//   try {
//     const { chatTitle, chatId, userMessage } = req.body;
//     const userId = req.user.id;

//     if (!userMessage && !req.file) {
//       return res
//         .status(400)
//         .json({ error: "Please provide a message or a file." });
//     }

//     let finalMessage = userMessage || "";
//     let fileUrl = null;

//     if (req.file) {
//       fileUrl = req.file.location;
//       const mime = req.file.mimetype;

//       const tempFilePath = `/tmp/${Date.now()}-${req.file.originalname}`;
//       const response = await fetch(fileUrl);
//       const buffer = await response.buffer();
//       fs.writeFileSync(tempFilePath, buffer);

//       if (mime === "application/pdf") {
//         const textContent = await extractTextFromPDF(tempFilePath);
//         finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
//       } else if (mime.startsWith("image/")) {
//         // Don't set corePath manually unless absolutely needed
//         const worker = await createWorker();

//         await worker.load();
//         await worker.loadLanguage("eng");
//         await worker.initialize("eng");

//         const {
//           data: { text },
//         } = await worker.recognize(tempFilePath);
//         finalMessage += `\n\nExtracted Text from Image:\n${text}`;

//         await worker.terminate();
//       }

//       fs.unlinkSync(tempFilePath);
//     }

//     const aiResponse = await getAIResponse(finalMessage);

//     const inquiry = await saveFinancialInquiry({
//       userId,
//       chatTitle,
//       chatId,
//       userMessage: finalMessage,
//       aiResponse,
//       fileUrl,
//     });

//     res.status(201).json({
//       status: "success",
//       message: "Inquiry processed and saved",
//       data: inquiry,
//     });
//   } catch (err) {
//     console.error("Error creating inquiry:", err);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error.",
//     });
//   }
// };

const createFinancialInquiry = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    // if (req.file) {
    //   fileUrl = req.file.location;
    //   const mime = req.file.mimetype;

    //   // Download the file to /tmp
    //   const tempFilePath = path.join(
    //     "/tmp",
    //     `${Date.now()}-${req.file.originalname}`
    //   );
    //   const response = await fetch(fileUrl);
    //   const buffer = await response.buffer();
    //   fs.writeFileSync(tempFilePath, buffer);

    //   if (mime === "application/pdf") {
    //     const textContent = await extractTextFromPDF(tempFilePath);
    //     finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
    //   } else if (mime.startsWith("image/")) {
    //     // const {
    //     //   data: { text },
    //     // } = await Tesseract.recognize(tempFilePath, "eng", {
    //     //   corePath:
    //     //     "https://cdn.jsdelivr.net/npm/tesseract.js-core@2.3.0/tesseract-core-simd.js",
    //     //   workerPath:
    //     //     "https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/dist/worker.min.js",
    //     //   langPath: "https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/lang",
    //     // });
    //     const {
    //       data: { text },
    //     } = await Tesseract.recognize(tempFilePath, "eng");

    //     finalMessage += `\n\nExtracted Text from Image:\n${text}`;
    //   }

    //   // Cleanup
    //   fs.unlinkSync(tempFilePath);
    // }
    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getAIResponse(finalMessage);

    const inquiry = await saveFinancialInquiry({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createInquiry = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getInquiryAIResponse(finalMessage);

    const inquiry = await saveInquiry({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createExpense = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getexpenseAIResponse(finalMessage);

    const inquiry = await saveExpense({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createBudget = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getbudgetAIResponse(finalMessage);

    const inquiry = await saveBudget({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createAnalysis = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getanalysisAIResponse(finalMessage);

    const inquiry = await saveAnalysis({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createGoal = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getgoalAIResponse(finalMessage);

    const inquiry = await saveGoal({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createCredit = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getcreditAIResponse(finalMessage);

    const inquiry = await saveCredit({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createLoan = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getloanAIResponse(finalMessage);

    const inquiry = await saveLoan({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createBuy = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getbuyAIResponse(finalMessage);

    const inquiry = await saveBuy({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createInvestment = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getinvestmentAIResponse(finalMessage);

    const inquiry = await saveInvestment({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createDefi = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getdefiAIResponse(finalMessage);

    const inquiry = await saveDefi({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createEd = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getedAIResponse(finalMessage);

    const inquiry = await saveEd({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createBusiness = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getbusinessAIResponse(finalMessage);

    const inquiry = await saveBusiness({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const createBnpl = async (req, res) => {
  try {
    const { chatTitle, chatId, userMessage } = req.body;
    const userId = req.user.id;

    if (!userMessage && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a message or a file." });
    }

    let finalMessage = userMessage || "";
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.location;
      const mime = req.file.mimetype;

      // Download the file to /tmp
      const tempFilePath = path.join(
        "/tmp",
        `${Date.now()}-${req.file.originalname}`
      );
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      fs.writeFileSync(tempFilePath, buffer);

      if (mime === "application/pdf") {
        const textContent = await extractTextFromPDF(tempFilePath);
        finalMessage += `\n\nSummarize this PDF:\n${textContent}`;
      } else if (mime.startsWith("image/")) {
        const text = await extractTextFromImageWithTextract(tempFilePath);
        finalMessage += `\n\nExtracted Text from Image:\n${text}`;
      }

      fs.unlinkSync(tempFilePath);
    }

    const aiResponse = await getbnplAIResponse(finalMessage);

    const inquiry = await saveBnpl({
      userId,
      chatTitle,
      chatId,
      userMessage: finalMessage,
      aiResponse,
      fileUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Inquiry processed and saved",
      data: inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getInquiriesByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

const getUserInquiry = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getInquiryByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserBuy = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getBuyByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserBnpl = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getBnplByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserDefi = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getDefiByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserCredit = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getCreditByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserLoan = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getLoanByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getBusinessByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserEd = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getEdByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getExpenseByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getAnalysisByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getBudgetByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getGoalByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
const getUserInvestment = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await getInvestmentByUser(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// const ArchiveAll = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await FinancialInquiry.updateMany({ userId }, { isArchived: true });
//     res.status(200).json({ message: "All chats archived." });
//   } catch (err) {
//     console.error("Error archiving all chats:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const ArchiveAll = async (req, res) => {
  try {
    const userId = req.user.id;
    await archiveAllForUser(userId);

    res.status(200).json({ message: "All chats archived." });
  } catch (err) {
    console.error("Error archiving all chats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const DeleteAll = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteAllInquiriesForUser(userId); // ⬅️ Uses the helper

    res.status(200).json({ message: "All chats deleted." });
  } catch (err) {
    console.error("Error deleting all chats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRecentInquiries = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the verified token
    const inquiries = await getInquiriesFromLast7Days(userId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching recent inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// const getChatsFromToday = async (req, res) => {
//   try {
//     const userId = req.user.id; // Use the user ID from the verified token

//     // Get today's date
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

//     // Fetch inquiries from today
//     const inquiries = await getInquiriesFromDateRange(
//       userId,
//       startOfDay,
//       endOfDay
//     );

//     res.status(200).json({
//       status: "success",
//       data: inquiries,
//     });
//   } catch (err) {
//     console.error("Error fetching today's inquiries:", err);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error.",
//     });
//   }
// };
const getChatsFromToday = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Use the model function
    const inquiries = await getInquiriesFromDateRange(
      userId,
      startOfDay,
      endOfDay
    );

    // Group inquiries by chat_id
    const groupedByChatId = {};
    for (const inquiry of inquiries) {
      if (!groupedByChatId[inquiry.chat_id]) {
        groupedByChatId[inquiry.chat_id] = [];
      }
      groupedByChatId[inquiry.chat_id].push(inquiry);
    }

    // Convert object to array of grouped arrays
    const groupedChats = Object.values(groupedByChatId);

    res.status(200).json({
      status: "success",
      data: groupedChats,
    });
  } catch (err) {
    console.error("Error fetching today's chats:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

const getChatsFromYesterday = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the verified token

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0)); // Start of yesterday
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999)); // End of yesterday

    // Fetch inquiries from yesterday
    const inquiries = await getInquiriesFromDateRange(
      userId,
      startOfDay,
      endOfDay
    );

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching yesterday's inquiries:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// Get distinct chat sessions for a user
const getUserChatSessions = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the verified token
    const sessions = await getChatSessionsByUser(userId);

    res.status(200).json({
      status: "success",
      data: sessions,
    });
  } catch (err) {
    console.error("Error fetching chat sessions:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// Get all messages in a chat session
const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the verified token
    const { chatId } = req.params; // The chat ID comes from the params
    const messages = await getMessagesByChatId(userId, chatId);

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// Controller to handle route logic
const getInquiriesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const inquiries = await getInquiriesByChatIdModel(userId, chatId);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching chat by chatId:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createFinancialInquiry,
  createBudget,
  createBuy,
  createAnalysis,
  createInvestment,
  createGoal,
  createCredit,
  createDefi,
  createBnpl,
  createEd,
  createExpense,
  createInquiry,
  createLoan,
  createBusiness,
  getUserInquiries,
  getUserBuy,
  getUserBudget,
  getUserInquiry,
  getUserLoan,
  getUserBnpl,
  getUserCredit,
  getUserEd,
  getUserExpense,
  getUserDefi,
  getUserAnalysis,
  getUserBusiness,
  getUserGoal,
  getUserInvestment,
  getUserRecentInquiries,
  ArchiveAll,
  getInquiriesByChatId,
  DeleteAll,
  getUserChatSessions,
  getChatMessages,
  getChatsFromYesterday,
  getChatsFromToday,
};
