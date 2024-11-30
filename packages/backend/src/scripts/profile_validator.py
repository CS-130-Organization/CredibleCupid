import dotenv
import os
from openai import OpenAI
import json
from enum import Enum

dotenv.load_dotenv()


class Model(Enum):
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"

class ProfileValidator:
    OPENAI_KEY = os.getenv("OPENAI_KEY")
    client = OpenAI(api_key=OPENAI_KEY)
    system_prompt = """You are an AI model trained to distinguish between human-written and AI-generated text on dating profiles. 
        You will be provided a json object; analyze its content, style, and structure to determine the likelihood that it was written by a human. Respond **only** with a JSON object in the following format:
        {"human_probability": float}"""

    @classmethod
    def validate_text(cls, data: json, model: Model = Model.GPT_4O_MINI.value) -> float:
        """
        Validates whether the provided user profile text is AI-written.
        Args:
            data (json): A JSON object containing the user profile text.
            model (Model): The OpenAI model to use for validation.
        Returns:
            float: Probability that the profile is human-written [0.0, 1.0]. -1 if there is an error.
        """
        # Get the system prompt and user prompt
        profile = json.dumps(data)
        prompt = f"Analyze the following user profile and determine the probability that it was written by a human. Provide the result in JSON format as {{\"human_probability\": float}}.\n\nProfile:\n{profile}"

        try:
            response = cls.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": cls.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                response_format={"type": "json_object"},
                n=1,
                stop=None,
            )
            
            response_json = json.loads(response.choices[0].message.content)
            probability = float(response_json.get("human_probability", -1))
            
            if probability < 0:
                raise ValueError("Invalid probability value")
            
            return probability

        except Exception as e:
            print(f"Error validating text or generating probability: {e}")
            return -1  # Default to 0.0 in case of other errors
