import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

export enum Model {
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
};

export class ProfileValidator {
  private static OPENAI_KEY: string = process.env.OPENAI_KEY ?? '';
  private static client: OpenAI = new OpenAI({
    apiKey: ProfileValidator.OPENAI_KEY,
  });
  private static systemPrompt: string = `You are an AI model trained to distinguish between human-written and AI-generated text on dating profiles. 
You will be provided a json object; analyze its content, style, and structure to determine the likelihood that it was written by a human. Respond **only** with a JSON object in the following format:
{"human_probability": float}`;

  constructor() {
    if (!ProfileValidator.OPENAI_KEY) {
      throw new Error('OPENAI_KEY environment variable is required');
    }
  }

  /**
   * Validates whether the provided user profile text is AI-written.
   * @param {Record<string, any>} data - A JSON object containing the user profile text.
   * @param {string} model - The OpenAI model to use for validation.
   * @returns {Promise<number>} - Probability that the profile is human-written [0.0, 1.0]. -1 if there is an error.
   */
  static async validateText(data: Record<string, any>, model: string = Model.GPT_4O_MINI): Promise<number> {
    const prompt = `Analyze the following user profile and determine the probability that it was written by a human. Provide the result in JSON format as {"human_probability": float}.\n\nProfile:\n${JSON.stringify(
      data
    )}`;

    try {
      const response = await ProfileValidator.client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: ProfileValidator.systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
        n: 1,
        stop: null,
        response_format: { type: "json_object" },
      });


      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in response");
      }
      const responseJson = JSON.parse(content);
      const probability = parseFloat(responseJson.human_probability);

      if (probability < 0) {
        throw new Error("Invalid probability value");
      }

      return Math.round(probability * 100); // round to nearest whole percent
    } catch (error) {
      console.error(`Error validating text or generating probability: ${error}`);
      return -1; // Default to -1 in case of errors
    }
  }
}


