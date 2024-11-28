import unittest
import json
from unittest.mock import patch
from packages.frontend.src.scripts.profile_validator import ProfileValidator, Model

class TestProfileValidator(unittest.TestCase):
    
    @patch('openai.ChatCompletion.create')
    def test_validate_text(self, mock_create):
        # Mock the OpenAI response
        mock_create.return_value.choices = [
            type('obj', (), {'message': type('obj', (), {'content': '{"human_probability": 0.85}'})})()
        ]

        # Test data
        test_profile = {
            "name": "John Doe",
            "bio": "I love hiking and photography. I grew up in the city but moved to the country for a more peaceful life."
        }

        # Run validation
        result = ProfileValidator.validate_text(test_profile)
        
        # Assert the result is as expected
        self.assertAlmostEqual(result, 0.85)
        
        # Verify OpenAI was called with correct parameters
        mock_create.assert_called_once()
        call_args = mock_create.call_args[1]
        self.assertEqual(call_args['model'], Model.GPT_4O)
        self.assertEqual(len(call_args['messages']), 2) 