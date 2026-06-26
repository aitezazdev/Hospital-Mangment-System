import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const AVAILABLE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

const generateWithFallback = async (aiInstance, prompt) => {
  let lastError = null;
  for (const modelName of AVAILABLE_MODELS) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = aiInstance.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        console.log(`Success using model: ${modelName}`);
        return text;
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini models failed to generate content.");
};


export const checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({ success: false, message: "Symptoms description is required" });
    }

    const aiInstance = getGenAI();
    if (!aiInstance) {
      
      const mockResponse = `AI Symptom Guidance (Simulation Mode)

Based on your symptoms "${symptoms}", here is some general educational guidance:

Potential Issues: Mild viral infection, fatigue, dehydration, or tension headache.
Recommended Specialties: General Physician or Primary Care Doctor.
Suggested Next Steps: Rest, stay hydrated, and monitor temperature. If symptoms worsen, please schedule an appointment.

Disclaimer: This is a simulated response because the Google Gemini API key is not configured. This AI assistant is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician if you are experiencing severe symptoms.`;
      
      return res.status(200).json({
        success: true,
        response: mockResponse,
        mocked: true,
      });
    }

    const prompt = `You are a professional, helpful clinical AI assistant integrated into a Hospital Management System. 
A patient is describing their symptoms as follows: "${symptoms}".

Please provide a natural, conversational, and helpful response. 
Follow these formatting rules strictly:
- Do NOT use any Markdown formatting whatsoever (no hashes '#', no asterisks '*', no bold '**', no bullet lists).
- Write in plain text, using normal paragraphs and standard spacing.
- Keep the tone empathetic, reassuring, and highly professional.

Your response should naturally cover:
1. Reassuring guidance on what might be causing their symptoms.
2. Which doctor specialties they should consult (e.g. Cardiologist, Dermatologist, General Physician, Neurologist, Pediatrician).
3. 2-3 simple home care or monitoring tips.
4. Red flag symptoms that require immediate emergency care.
5. A simple, plain-text disclaimer at the end stating that this is for guidance only and they should consult a doctor for a proper diagnosis.

Keep the entire response under 200 words.`;

    const responseText = await generateWithFallback(aiInstance, prompt);

    return res.status(200).json({
      success: true,
      response: responseText,
      mocked: false,
    });
  } catch (error) {
    console.error("Gemini API Error in checkSymptoms:", error);
    next(error);
  }
};


export const summarizeClinicalDetails = async (req, res, next) => {
  try {
    const { patientHistory, reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: "Appointment reason is required" });
    }

    const historyText = Array.isArray(patientHistory) && patientHistory.length > 0
      ? patientHistory.join(", ")
      : "No recorded medical history";

    const aiInstance = getGenAI();
    if (!aiInstance) {
      
      const mockSummary = `Patient presents with: "${reason}". Medical history notes: "${historyText}". 
Focus areas: Assess acute symptoms, review contraindications related to history, check vitals, and outline treatment plan.`;
      
      return res.status(200).json({
        success: true,
        summary: mockSummary,
        mocked: true,
      });
    }

    const prompt = `You are an expert clinical summarizer. Summarize the following patient details in a short, professional, clinical paragraph (2-3 sentences) suitable for a doctor to review right before an appointment.
    
- Patient Medical History: ${historyText}
- Reason for Appointment: ${reason}

Write a direct, objective clinical summary highlighting key areas of focus or risk. Do not include introductory text like "Here is the summary". Go straight to the clinical synthesis.`;

    const summaryText = (await generateWithFallback(aiInstance, prompt)).trim();

    return res.status(200).json({
      success: true,
      summary: summaryText,
      mocked: false,
    });
  } catch (error) {
    console.error("Gemini API Error in summarizeClinicalDetails:", error);
    next(error);
  }
};


export const recommendMedicines = async (req, res, next) => {
  try {
    const { symptoms, history } = req.body;
    if (!symptoms) {
      return res.status(400).json({ success: false, message: "Symptoms or reason for appointment is required" });
    }

    const historyText = history || "No recorded medical history";

    const aiInstance = getGenAI();
    if (!aiInstance) {
      
      const mockRecommendation = `AI Suggested Prescription (Simulation Mode)

Suggested Medicines:
1. Paracetamol 500mg - Take 1 tablet twice a day after meals as needed for fever/pain relief (Max 3 days).
2. Cetirizine 10mg - Take 1 tablet once daily before bed for allergic symptoms/running nose.
3. Oral Rehydration Salts (ORS) - Mix 1 sachet in 1 liter of clean water and drink continuously to prevent dehydration.

Clinical Warnings:
- Rule out any prior allergy to paracetamol or antihistamines.
- Advise patient to seek emergency care if high fever persists or breathing difficulty arises.

Disclaimer: This suggestion is generated by AI in simulation mode. The prescribing physician must review, adjust, and approve this before signing.`;
      
      return res.status(200).json({
        success: true,
        recommendation: mockRecommendation,
        mocked: true,
      });
    }

    const prompt = `You are an expert clinical pharmacologist assisting a doctor in generating a suggested prescription list.
The patient presents with the following symptoms/complaint: "${symptoms}".
The patient's recorded medical history is: "${historyText}".

Please suggest appropriate, safe, and common over-the-counter or primary care medicines, including dosages and duration.
Follow these formatting rules strictly:
- Do NOT use any Markdown formatting whatsoever (no hashes '#', no asterisks '*', no bold '**', no bullet lists).
- Write in plain text, using normal paragraphs and standard spacing.
- Start directly with the suggested medicines.
- Underneath, list any clinical warnings or contraindications based on the symptoms and history.
- End with a short warning stating: "Disclaimer: This suggestion is AI-generated for doctor assistance. The physician must review and approve this prescription."

Keep the entire recommendation under 250 words.`;

    const recommendationText = await generateWithFallback(aiInstance, prompt);

    return res.status(200).json({
      success: true,
      recommendation: recommendationText,
      mocked: false,
    });
  } catch (error) {
    console.error("Gemini API Error in recommendMedicines:", error);
    next(error);
  }
};
