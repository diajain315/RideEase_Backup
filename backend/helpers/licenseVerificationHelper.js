import fs from "fs";
import Tesseract from "tesseract.js";

// Helper to clean and normalize text
const normalizeText = (text = "") => {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Detect format by file buffer magic bytes or extension
const detectDocumentType = (buffer, mimeType = "", fileName = "") => {
  const name = (fileName || "").toLowerCase();
  const mime = (mimeType || "").toLowerCase();

  if (name.endsWith(".pdf") || mime.includes("pdf")) {
    return "pdf";
  }

  if (!buffer || buffer.length < 4) return "unknown";

  // PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return "pdf";
  }

  // JPEG magic bytes: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  // PNG magic bytes: 0x89 0x50 0x4E 0x47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return "unknown";
};

// Safe OCR runner with timeout and error protection
const safeOcrRun = (imageBuffer) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve("");
    }, 7000);

    Tesseract.recognize(imageBuffer, "eng")
      .then((result) => {
        clearTimeout(timeout);
        resolve(result?.data?.text || "");
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.warn("OCR notice (handled safely):", err?.message || err);
        resolve("");
      });
  });
};

/**
 * Crash-proof Driving License document verification.
 * 
 * 1. Checks magic bytes: PDF documents (DigiLocker / Parivahan e-DL) pass.
 * 2. If Gemini Vision API key exists: runs AI image inspection.
 * 3. Fallback: runs safe Tesseract OCR scanning for official DL keywords and regex.
 */
export const verifyDrivingLicenseDocument = async (
  filePath,
  mimeType = "",
  enteredDlNumber = "",
  originalName = ""
) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return {
        isValid: false,
        engine: "file-system",
        confidence: 0,
        reason: "Document file could not be read. Please choose a valid file.",
      };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const docType = detectDocumentType(fileBuffer, mimeType, originalName);

    // 1. Digital PDF Driving License (e.g., from Parivahan/DigiLocker)
    if (docType === "pdf") {
      return {
        isValid: true,
        engine: "digital-pdf",
        confidence: 0.95,
        reason: "Digital Driving License document (PDF format) accepted.",
      };
    }

    // 2. Reject unsupported or corrupt non-image files
    if (docType === "unknown") {
      return {
        isValid: false,
        engine: "format-detector",
        confidence: 0.95,
        reason: "Unsupported image format. Please upload a clear JPG, PNG, or PDF of your Driving License.",
      };
    }

    // 3. Try Gemini Vision AI if API key is configured
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = fileBuffer.toString("base64");
        const prompt = `
          You are a strict KYC Document Verification AI for a vehicle rental company.
          Analyze this image carefully.
          
          Determine:
          1. Is this image a genuine government-issued Driving License card or paper document? (It must NOT be a selfie, pet, random object, car photo, passport, aadhaar card, PAN card, utility bill, or blank screen).
          2. Can you read driving license details on it?
          
          Respond ONLY with a JSON object in this exact format (no markdown fences, no extra text):
          {
            "isDrivingLicense": true,
            "confidence": 0.95,
            "detectedDocType": "Driving License",
            "extractedLicenseNumber": "...",
            "extractedName": "...",
            "reason": "Clear driving license showing transport department and vehicle classes."
          }
          If it is NOT a driving license, set:
          {
            "isDrivingLicense": false,
            "confidence": 0.98,
            "detectedDocType": "Unknown / Non-DL",
            "extractedLicenseNumber": null,
            "extractedName": null,
            "reason": "The uploaded image is not a Driving License. Detected: [what you saw]."
          }
        `;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: `image/${docType}`,
            },
          },
        ]);

        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          isValid: Boolean(parsed.isDrivingLicense),
          engine: "gemini-vision",
          confidence: parsed.confidence || 0.9,
          reason: parsed.reason || (parsed.isDrivingLicense ? "Valid Driving License verified by AI" : "Document rejected as not a Driving License"),
          extractedDl: parsed.extractedLicenseNumber || null,
        };
      } catch (geminiErr) {
        console.warn("Notice: Gemini Vision verification notice:", geminiErr.message);
      }
    }

    // 4. Safe In-House OCR Verification Engine (Tesseract.js)
    const rawText = await safeOcrRun(fileBuffer);
    const cleanText = normalizeText(rawText);

    const strongKeywords = [
      "DRIVING LICENCE",
      "DRIVING LICENSE",
      "UNION OF INDIA",
      "TRANSPORT DEPARTMENT",
      "AUTHORISATION TO DRIVE",
      "AUTHORIZATION TO DRIVE",
      "FORM 7",
      "FORM-7",
      "LICENCE TO DRIVE",
      "LICENSE TO DRIVE",
      "MOTOR VEHICLES",
    ];

    const mediumKeywords = [
      "DL NO",
      "DLNO",
      "D.L.NO",
      "LICENCE NO",
      "LICENSE NO",
      "MCWG",
      "LMV",
      "MCWOG",
      "COV",
      "CLASS OF VEHICLE",
    ];

    const weakKeywords = [
      "DOB",
      "DATE OF BIRTH",
      "VALIDITY",
      "VALID TILL",
      "NON TRANSPORT",
      "TRANSPORT",
      "ISSUE DATE",
      "SIGNATURE",
    ];

    const dlRegexPatterns = [
      /[A-Z]{2}[ -]?[0-9]{2}[ -]?[0-9]{4}[ -]?[0-9]{7}/,
      /[A-Z]{2}[0-9]{13,15}/,
      /[A-Z]{2}[ -]?[0-9]{2}[ -]?[0-9]{11}/,
      /[A-Z]{2}[0-9]{2}[ -]?[0-9]{11}/,
    ];

    let score = 0;
    const foundKeywords = [];

    strongKeywords.forEach((kw) => {
      if (cleanText.includes(kw)) {
        score += 3;
        foundKeywords.push(kw);
      }
    });

    mediumKeywords.forEach((kw) => {
      if (cleanText.includes(kw)) {
        score += 2;
        foundKeywords.push(kw);
      }
    });

    let weakCount = 0;
    weakKeywords.forEach((kw) => {
      if (cleanText.includes(kw) && weakCount < 2) {
        score += 1;
        weakCount += 1;
        foundKeywords.push(kw);
      }
    });

    let matchedDl = null;
    for (const regex of dlRegexPatterns) {
      const match = cleanText.match(regex);
      if (match) {
        matchedDl = match[0];
        score += 4;
        break;
      }
    }

    if (enteredDlNumber) {
      const cleanEntered = normalizeText(enteredDlNumber).replace(/[^A-Z0-9]/g, "");
      const cleanRaw = cleanText.replace(/[^A-Z0-9]/g, "");
      if (cleanEntered.length >= 8 && cleanRaw.includes(cleanEntered)) {
        score += 4;
        foundKeywords.push("MATCHED_ENTERED_NUMBER");
      }
    }

    // Threshold check: Score >= 4 indicates authentic Driving License
    const isDl = score >= 4;

    if (isDl) {
      return {
        isValid: true,
        engine: "tesseract-ocr",
        confidence: Math.min(0.95, 0.6 + score * 0.05),
        reason: `Driving License verified successfully. Matched markers: ${foundKeywords.slice(0, 3).join(", ")}.`,
        extractedDl: matchedDl,
      };
    } else {
      return {
        isValid: false,
        engine: "tesseract-ocr",
        confidence: 0.9,
        reason: "Uploaded image does not appear to be an official Driving License. Please upload a clear, legible photo of your Driving License card.",
      };
    }
  } catch (error) {
    console.error("Driving license verification error (handled):", error);
    return {
      isValid: false,
      engine: "fallback-error",
      confidence: 0,
      reason: "Could not read document clearly. Please ensure the image is sharp and legible.",
    };
  }
};
