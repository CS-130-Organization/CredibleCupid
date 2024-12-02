import { ProfileValidator, Model } from './profileValidator';

interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  gender: string;
  pronouns: string;
  sexual_orientation: string;
  date_of_birth: string;
  birthday_ms_since_epoch: number;
  height_mm: number;
  height_ft: number;
  height_in: number;
  occupation: string;
}

// testing true output from OpenAI because we can afford unmocked requests to simplify testing
const testResponse = async (): Promise<number> => {
  const testData: ProfileData = {
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
  };
  
  return await ProfileValidator.validateText(testData);
};

testResponse().then(console.log);