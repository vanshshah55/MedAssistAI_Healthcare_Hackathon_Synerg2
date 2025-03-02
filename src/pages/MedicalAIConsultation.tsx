import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Download, Loader2, User, Bot, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConsultationReport {
  symptoms: string[];
  diagnosis: string;
  recommendations: string[];
  precautions: string[];
  medications: string[];
  lifestyle: string[];
  followUp: string;
}

const GROQ_API_KEY = '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';

const MedicalAIConsultation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consultationReport, setConsultationReport] = useState<ConsultationReport | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const systemPrompt = `You are an AI medical consultation assistant. Your role is to:
1. Ask relevant questions about the user's symptoms and medical history
2. Provide accurate medical information and advice
3. Suggest precautions and lifestyle changes
4. Recommend when to seek professional medical help
5. Generate structured consultation reports

Important: Always maintain a professional and empathetic tone. Include disclaimers when appropriate.
Format your responses in clear, easy-to-read sections.`;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateConsultationReport = async (conversation: Message[]) => {
    const prompt = `Based on our conversation, please generate a structured medical consultation report in the following JSON format:
    {
      "symptoms": [list of reported symptoms],
      "diagnosis": "potential diagnosis based on symptoms",
      "recommendations": [list of recommendations],
      "precautions": [list of precautions to take],
      "medications": [list of suggested medications if applicable],
      "lifestyle": [list of lifestyle changes],
      "followUp": "follow-up advice"
    }

    Make sure to extract all relevant medical information from this conversation:
    ${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}`;

    try {
      const response = await callGroqAPI(prompt, true);
      console.log('Report generation response:', response);
      
      try {
        const parsedResponse = JSON.parse(response);
        if (!parsedResponse.symptoms || !parsedResponse.diagnosis || !parsedResponse.recommendations) {
          throw new Error('Invalid report format');
        }
        return response;
      } catch (e) {
        console.error('Error parsing report JSON:', e);
        throw new Error('Failed to generate report from conversation');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  // Add this new function for local responses
  const generateLocalResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Common medical symptoms and responses
    if (lowerCaseMessage.includes('headache') || lowerCaseMessage.includes('head pain')) {
      return `I understand you're experiencing headaches. This could be due to various factors such as stress, dehydration, lack of sleep, or eye strain.

Some questions to consider:
- How long have you been experiencing these headaches?
- Is the pain on one side or both sides of your head?
- Have you noticed any triggers like certain foods or activities?

For mild headaches, you might try:
- Drinking plenty of water
- Getting adequate rest
- Taking over-the-counter pain relievers like acetaminophen or ibuprofen
- Applying a cold or warm compress

If your headaches are severe, persistent, or accompanied by other symptoms like fever, vision changes, or neck stiffness, please consult a healthcare professional immediately.`;
    }
    
    if (lowerCaseMessage.includes('fever') || lowerCaseMessage.includes('temperature')) {
      return `I see you're concerned about a fever. A fever is often a sign that your body is fighting an infection.

Some important questions:
- What is your current temperature?
- Do you have any other symptoms like cough, sore throat, or body aches?
- How long have you had the fever?

For managing a fever:
- Stay hydrated by drinking plenty of fluids
- Rest as much as possible
- Take acetaminophen or ibuprofen as directed to reduce fever
- Use a light blanket if you have chills

You should seek immediate medical attention if:
- Your temperature exceeds 103°F (39.4°C)
- The fever lasts more than 3 days
- You have severe headache, rash, or neck stiffness
- You have difficulty breathing

Remember that while I can provide general information, I cannot diagnose conditions. Please consult a healthcare provider for proper diagnosis and treatment.`;
    }
    
    if (lowerCaseMessage.includes('cough') || lowerCaseMessage.includes('cold') || lowerCaseMessage.includes('flu')) {
      return `I understand you're experiencing symptoms that might be related to a cold or flu.

Some questions to help understand your situation better:
- How long have you had these symptoms?
- Do you have a fever, and if so, what's your temperature?
- Are you experiencing any other symptoms like body aches, fatigue, or sore throat?
- Have you been in contact with anyone who has similar symptoms?

For managing cold or flu symptoms:
- Rest and stay hydrated
- Over-the-counter medications like acetaminophen or ibuprofen can help with fever and pain
- Honey and warm liquids may soothe a sore throat (avoid honey for children under 1 year)
- A humidifier might help with congestion

You should seek medical attention if:
- You have difficulty breathing
- Your symptoms are severe or worsening
- You have a persistent high fever
- You're at high risk for complications (elderly, pregnant, or have chronic conditions)

Remember that antibiotics are not effective against viruses that cause colds and flu. If your symptoms persist or worsen, please consult a healthcare provider.`;
    }
    
    if (lowerCaseMessage.includes('stomach') || lowerCaseMessage.includes('nausea') || lowerCaseMessage.includes('vomit') || lowerCaseMessage.includes('diarrhea')) {
      return `I'm sorry to hear you're experiencing stomach issues. Gastrointestinal symptoms can be uncomfortable but are often temporary.

Some questions to consider:
- When did your symptoms begin?
- Have you eaten anything unusual recently?
- Are you experiencing pain, and if so, where is it located?
- Have you been able to keep fluids down?

For managing stomach issues:
- Stay hydrated with small sips of water, clear broth, or electrolyte solutions
- Avoid solid foods until vomiting subsides
- Gradually introduce bland foods like toast, rice, bananas, and applesauce
- Avoid dairy, caffeine, alcohol, and fatty or spicy foods

You should seek immediate medical attention if:
- You have severe abdominal pain
- You see blood in your vomit or stool
- You have signs of dehydration (excessive thirst, dry mouth, little or no urination, severe weakness)
- Your symptoms persist for more than a few days

Remember that food poisoning, viral gastroenteritis, and other conditions can cause similar symptoms. If your symptoms are severe or persistent, please consult a healthcare provider.`;
    }
    
    if (lowerCaseMessage.includes('back pain') || lowerCaseMessage.includes('backache')) {
      return `I understand you're dealing with back pain, which can be quite disruptive to daily life.

Some questions to help understand your situation:
- Where exactly is the pain located?
- Did the pain start suddenly or gradually?
- Is the pain constant or does it come and go?
- Does any particular position or activity make it better or worse?

For managing back pain:
- Apply ice for the first 48-72 hours, then switch to heat
- Over-the-counter pain relievers like ibuprofen or acetaminophen may help
- Gentle stretching and movement (avoid bed rest for extended periods)
- Maintain good posture and ergonomics

You should seek immediate medical attention if:
- The pain is severe or getting worse
- The pain radiates down your leg, especially below the knee
- You experience numbness, tingling, or weakness in your legs
- You have difficulty with bladder or bowel control

Most back pain improves with self-care within a few weeks. If your pain persists or is severe, please consult a healthcare provider for proper evaluation and treatment.`;
    }
    
    // Default response for any other health concerns
    return `Thank you for sharing your health concern. While I can provide general information, I'm currently operating in offline mode due to connectivity issues with our medical database.

To better understand your situation, I'd like to know:
- How long have you been experiencing these symptoms?
- Are they constant or do they come and go?
- Have you tried any remedies or treatments so far?
- Do you have any known medical conditions?

Remember that this conversation is not a substitute for professional medical advice. If you're experiencing severe symptoms, please consult a healthcare provider promptly.

I'm happy to continue our conversation and provide general health information based on what you share.`;
  };

  // Add this function to generate a local consultation report
  const generateLocalConsultationReport = (messages: Message[]): ConsultationReport => {
    // Extract user messages
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    const allText = userMessages.join(' ').toLowerCase();
    
    // Default report structure
    const report: ConsultationReport = {
      symptoms: [],
      diagnosis: "Based on the limited information provided, a specific diagnosis cannot be determined.",
      recommendations: [
        "Consult with a healthcare provider for proper evaluation",
        "Monitor your symptoms and note any changes",
        "Maintain adequate hydration and rest"
      ],
      precautions: [
        "Seek immediate medical attention if symptoms worsen",
        "Follow general hygiene practices"
      ],
      medications: [],
      lifestyle: [
        "Ensure adequate sleep",
        "Maintain a balanced diet",
        "Stay physically active as appropriate"
      ],
      followUp: "Schedule an appointment with your primary care physician for a thorough evaluation."
    };
    
    // Extract symptoms based on keywords
    const symptomKeywords = [
      'headache', 'fever', 'cough', 'pain', 'nausea', 'vomiting', 'diarrhea', 
      'fatigue', 'tired', 'dizzy', 'rash', 'itch', 'sore throat', 'congestion',
      'runny nose', 'shortness of breath', 'chest pain', 'back pain', 'joint pain'
    ];
    
    symptomKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        report.symptoms.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    // If no symptoms detected, add a placeholder
    if (report.symptoms.length === 0) {
      report.symptoms.push("Unspecified symptoms");
    }
    
    // Customize recommendations based on detected symptoms
    if (report.symptoms.includes('Headache')) {
      report.recommendations.push("Consider over-the-counter pain relievers if appropriate");
      report.recommendations.push("Apply a cold or warm compress to the forehead or neck");
      report.lifestyle.push("Practice stress reduction techniques");
      report.lifestyle.push("Ensure proper ergonomics when using screens");
    }
    
    if (report.symptoms.includes('Fever')) {
      report.recommendations.push("Monitor temperature regularly");
      report.recommendations.push("Use appropriate fever-reducing medication if needed");
      report.precautions.push("Seek medical attention if fever exceeds 103°F (39.4°C)");
      report.medications.push("Acetaminophen or ibuprofen as directed for fever reduction");
    }
    
    if (report.symptoms.includes('Cough') || report.symptoms.includes('Sore throat')) {
      report.recommendations.push("Use honey and warm liquids to soothe throat (if age-appropriate)");
      report.recommendations.push("Consider using a humidifier");
      report.medications.push("Over-the-counter cough suppressants or throat lozenges if appropriate");
      report.precautions.push("Cover mouth when coughing to prevent spread of infection");
    }
    
    return report;
  };

  const callGroqAPI = async (prompt: string, isReportGeneration: boolean = false) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: isReportGeneration ? 0.3 : 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Groq API');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      // Return local response instead of throwing error
      return isReportGeneration 
        ? JSON.stringify(generateLocalConsultationReport([{ role: 'user', content: prompt, timestamp: new Date() }]))
        : generateLocalResponse(prompt);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await callGroqAPI(inputMessage);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      try {
        // Use local report generation if API fails
        let reportJson;
        try {
          reportJson = await generateConsultationReport([...messages, newMessage, assistantMessage]);
        } catch (e) {
          console.log('Using local report generation due to API error');
          reportJson = JSON.stringify(generateLocalConsultationReport([...messages, newMessage, assistantMessage]));
        }
        
        const report = JSON.parse(reportJson);
        setConsultationReport(report);
      } catch (e) {
        console.error('Error in report generation process:', e);
        setError('Please have a conversation about your health concerns first.');
      }
    } catch (error) {
      setError('Failed to get response from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    try {
      if (!consultationReport || !messages.length) {
        console.error('No consultation report or messages available');
        setError('Please complete the consultation first to generate a report.');
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPos = margin;

      // Add logo and header
      doc.setFillColor(44, 62, 80);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Medical Consultation Report', pageWidth / 2, 25, { align: 'center' });

      // Add report info
      yPos = 50;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      const reportId = Math.random().toString(36).substr(2, 9).toUpperCase();
      doc.text(`Report ID: ${reportId}`, margin, yPos);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPos, { align: 'right' });

      // Add patient summary section
      yPos = 70;
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(16);
      doc.text('Patient Summary', margin + 5, yPos + 10);
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      doc.text('Based on AI-assisted medical consultation', margin + 5, yPos + 20);
      doc.text(`Consultation Date: ${new Date().toLocaleDateString()}`, margin + 5, yPos + 30);

      // Add symptoms section
      yPos = 120;
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(16);
      doc.text('Reported Symptoms', margin, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      consultationReport.symptoms.forEach(symptom => {
        doc.circle(margin + 3, yPos + 3, 1, 'F');
        doc.text(symptom, margin + 8, yPos + 5);
        yPos += 10;
      });

      // Add diagnosis section
      yPos += 10;
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(16);
      doc.text('Clinical Assessment', margin, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      const splitDiagnosis = doc.splitTextToSize(consultationReport.diagnosis, pageWidth - (margin * 2));
      doc.text(splitDiagnosis, margin, yPos);
      yPos += splitDiagnosis.length * 7 + 10;

      // Add recommendations section
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(16);
      doc.text('Recommendations', margin, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      consultationReport.recommendations.forEach(rec => {
        doc.circle(margin + 3, yPos + 3, 1, 'F');
        const splitRec = doc.splitTextToSize(rec, pageWidth - (margin * 2) - 10);
        doc.text(splitRec, margin + 8, yPos + 5);
        yPos += splitRec.length * 7 + 5;
      });

      // Add medications section if available
      if (consultationReport.medications.length > 0) {
        yPos += 10;
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(16);
        doc.text('Medications', margin, yPos);
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105);
        consultationReport.medications.forEach(med => {
          doc.circle(margin + 3, yPos + 3, 1, 'F');
          doc.text(med, margin + 8, yPos + 5);
          yPos += 10;
        });
      }

      // Add footer
      doc.setFillColor(44, 62, 80);
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('CONFIDENTIAL MEDICAL REPORT', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text(`Report ID: ${reportId}`, margin, pageHeight - 15);
      doc.text('Page 1/1', pageWidth - margin, pageHeight - 15, { align: 'right' });

      // Add disclaimer
      doc.addPage();
      yPos = margin;
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(16);
      doc.text('Important Medical Disclaimer', margin, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      const disclaimer = `This AI-generated medical consultation report is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. The information provided in this report is based on the symptoms and information shared during the AI consultation session.

Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this report.

If you think you may have a medical emergency, call your doctor or emergency services immediately.

This report was generated on ${new Date().toLocaleString()} using advanced AI technology. While we strive for accuracy, AI-generated content should always be verified by healthcare professionals.`;

      const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - (margin * 2));
      doc.text(splitDisclaimer, margin, yPos);

      // Save the PDF
      const fileName = `medical-consultation-${reportId}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-center">
            <MessageSquare size={24} className="mr-3" />
            <h1 className="text-2xl font-bold">AI Medical Consultation</h1>
          </div>
          <p className="mt-2 text-blue-100 text-center">
            Discuss your health concerns with our AI assistant for personalized advice and recommendations.
          </p>
        </div>

        <div className="p-6">
          {/* Chat Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-lg h-[600px] flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User size={18} />
                        ) : (
                          <Bot size={18} />
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-xl shadow-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center space-x-2 text-gray-500 bg-white p-4 rounded-lg shadow-md">
                    <Loader2 size={18} className="animate-spin" />
                    <span>AI is analyzing your request...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg shadow-md">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your symptoms or ask a health question..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className={`min-w-[100px] px-4 py-3 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 ${
                      isLoading || !inputMessage.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                  >
                    <Send size={18} className="mr-2" />
                    Send
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={!consultationReport}
                    className={`min-w-[120px] px-4 py-3 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 ${
                      !consultationReport
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                    }`}
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAIConsultation; 