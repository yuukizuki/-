
import { GoogleGenAI } from "@google/genai";

export async function generateUrbanRender(
  base64Image: string,
  basePrompt: string,
  granularity: number,
  patternMode: string,
  mimeType: string = 'image/png'
): Promise<string> {
  // Always create a new instance to ensure it picks up the latest API key environment variable.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const detailDescription = granularity > 70 ? "extremely high detail and complex textures" : "clean and clear architectural volumes";
  
  // Refined prompt focused purely on the source map and chosen style
  let promptText = `URBAN ARCHITECTURAL RENDERING TASK.
    
    SOURCE LAYOUT: Use the provided image as the ABSOLUTE structural master. 
    - You MUST maintain every building footprint, street alignment, and plot boundary exactly as drawn.
    - Do not alter the camera angle or the scale of the urban fabric.
    
    TASK:
    - Transform this flat or basic city fabric into a full architectural rendering.
    - Style Theme: ${basePrompt}
    - Detail Density: ${detailDescription}.
    - Material Mapping: Apply ${patternMode} distribution for textures and landscaping.
    
    QUALITY SPECS:
    - High-end architectural visualization (ArchViz) standard.
    - Realistic shadows, ambient occlusion, and cinematic lighting.
    - 8K resolution feel with sharp edges and professional post-processing.`;

  try {
    const parts: any[] = [
      {
        inlineData: {
          data: base64Image.split(',')[1] || base64Image,
          mimeType: mimeType,
        },
      },
      { text: promptText }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let generatedImageBase64 = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("Generation completed but no image was found in the response.");
    }

    return generatedImageBase64;
  } catch (error: any) {
    console.error("Rendering Error:", error);
    if (error.message?.includes("403") || error.message?.includes("API_KEY")) {
      throw new Error("Access Denied: Please check if your API Key is from a paid project and has Image generation enabled.");
    }
    throw new Error(error.message || "Rendering failed. Please try a clearer source map.");
  }
}
