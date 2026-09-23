
import { GoogleGenAI } from "@google/genai";
import { Facility, RoomType } from '../types';

/**
 * Generates a response from the AI concierge.
 * Follows guidelines to use new GoogleGenAI instance for each call.
 */
export const getConciergeResponse = async (
  userMessage: string, 
  facilities: Facility[], 
  rooms: RoomType[]
): Promise<string> => {
  // Always initialize GoogleGenAI with a named parameter in each call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const facilitiesList = facilities.map(f => f.name).join(', ');
  const roomsList = rooms.map(r => `${r.name} (NPR ${r.pricePerNight}, sleeps ${r.capacity})`).join('; ');

  const systemInstruction = `
    You are a helpful Hotel Concierge for 'Mero-Booking' (formerly known as HotelEase).
    
    Hotel Data:
    - Facilities: ${facilitiesList}
    - Room Types: ${roomsList}
    
    Answer the guest's question politely and briefly.
    If they ask about rooms, suggest the best fit from the list.
    If they ask about amenities, check the facilities list.
    If you don't know, say "Please check with the front desk."
    Always refer to the hotel as "Mero-Booking".
  `;

  try {
    // Correctly call generateContent with model and prompt as part of the parameters object
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction,
      }
    });

    // Access the .text property directly on the response object
    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the network right now.";
  }
};
