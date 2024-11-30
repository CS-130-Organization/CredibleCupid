import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const Model = {
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
};

class ProfileValidator {
  static OPENAI_KEY = process.env.OPENAI_KEY;
  static client = new OpenAIApi(
    new Configuration({
      apiKey: ProfileValidator.OPENAI_KEY,
    })
  );
  static systemPrompt = `You are an AI model trained to distinguish between human-written and AI-generated text on dating profiles. 
You will be provided a json object; analyze its content, style, and structure to determine the likelihood that it was written by a human. Respond **only** with a JSON object in the following format:
{"human_probability": float}`;

  /**
   * Validates whether the provided user profile text is AI-written.
   * @param {Object} data - A JSON object containing the user profile text.
   * @param {string} model - The OpenAI model to use for validation.
   * @returns {Promise<number>} - Probability that the profile is human-written [0.0, 1.0]. -1 if there is an error.
   */
  static async validateText(data, model = Model.GPT_4O_MINI) {
    const prompt = `Analyze the following user profile and determine the probability that it was written by a human. Provide the result in JSON format as {"human_probability": float}.\n\nProfile:\n${JSON.stringify(
      data
    )}`;

    try {
      const response = await ProfileValidator.client.createChatCompletion({
        model: model,
        messages: [
          { role: "system", content: ProfileValidator.systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
        n: 1,
        stop: null,
      });

      const content = response.data.choices[0].message.content;
      const responseJson = JSON.parse(content);
      const probability = parseFloat(responseJson.human_probability);

      if (probability < 0) {
        throw new Error("Invalid probability value");
      }

      return probability;
    } catch (error) {
      console.error(`Error validating text or generating probability: ${error}`);
      return -1; // Default to -1 in case of errors
    }
  }
}

export { ProfileValidator, Model }; 