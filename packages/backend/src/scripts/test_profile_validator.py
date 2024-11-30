import unittest
import json
from unittest.mock import patch
from packages.backend.src.scripts.profile_validator import ProfileValidator, Model

class TestProfileValidator(unittest.TestCase):
    
    @patch('packages.backend.src.scripts.profile_validator.ProfileValidator.client.chat.completions.create')
    def test_validate_text(self, mock_create):
        # Mock the OpenAI response
        mock_create.return_value.choices = [
            type('obj', (), {'message': type('obj', (), {'content': '{"human_probability": 0.85}'})})()
        ]

        # Test data
        test_profile_str: str = json.dumps({
            "email": "john@yahoo.com",
            "first_name": "John",
            "last_name": "Smith",
            "bio": "I love hiking and photography. I grew up in the city but moved to the country for a more peaceful life.",
            "gender": "Male",
            "pronouns": "he/him",
            "sexual_orientation": "Other",
            "date_of_birth": "2001-01-01",
            "birthday_ms_since_epoch": 978307200000,
            "height_mm": 0,
            "height_ft": 0,
            "height_in": 0,
            "occupation": "null"
        })

        test_profile: dict = json.loads(test_profile_str)

        # Run validation
        result = ProfileValidator.validate_text(test_profile)
        
        # Assert the result is as expected
        self.assertAlmostEqual(result, 0.85)
        
        # Verify OpenAI was called with correct parameters
        mock_create.assert_called_once()
        call_args = mock_create.call_args[1]
        self.assertEqual(call_args['model'], Model.GPT_4O_MINI.value)
        self.assertEqual(len(call_args['messages']), 2) 