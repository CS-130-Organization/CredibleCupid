import requests
import random
import time

# Sample lists of common first and last names
first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor",
    "Moore", "Jackson", "Martin", "Lee"
]

def generate_random_email():
    name = ''.join(random.choices("abcdefghijklmnopqrstuvwxyz", k=10))
    return f"{name}@gmail.com"

def generate_random_first_name():
    return random.choice(first_names)

def generate_random_last_name():
    return random.choice(last_names)

def generate_random_birthday():
    # Generate an age between 18 and 60 years
    age_in_years = random.randint(18, 28)
    # Calculate the birthday timestamp based on the current time
    birthday_seconds = int(time.time()) - age_in_years * 365 * 24 * 60 * 60
    return birthday_seconds * 1000  # Convert to milliseconds

def generate_random_user_data():
    gender = random.choice(["Male", "Female"])
    pronouns = "He/Him" if gender == "Male" else "She/Her"
    return {
        "first_name": generate_random_first_name(),
        "last_name": generate_random_last_name(),
        "bio": "Test user bio",
        "gender": gender,
        "pronouns": pronouns,
        "sexual_orientation": random.choice(["Straight", "Gay", "Bisexual"]),
        "birthday_ms_since_epoch": generate_random_birthday(),
        "height_mm": random.randint(1500, 2000),
        "occupation": random.choice(["Engineer", "Designer", "Teacher", "Professional Cutie"])
    }

def create_user():
    login_url = "http://localhost:8000/auth/signup"
    update_bio_url = "http://localhost:8000/user/update_bio"
    
    # Step 1: Login and retrieve JWT
    login_data = {
        "email": generate_random_email(),
        "password": "password"
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }
    response = requests.post(login_url, headers=headers, json=login_data)
    
    if response.status_code == 201:
        jwt = response.json().get("jwt")
        
        # Step 2: Update user bio
        if jwt:
            bio_data = generate_random_user_data()
            bio_headers = {
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
            bio_response = requests.post(update_bio_url, headers=bio_headers, json=bio_data)
            return bio_response.status_code, bio_response.json()
    return response.status_code, response.json()

# Create 100 test users
for i in range(100):
    status_code, result = create_user()
    print(f"User {i+1} - Status: {status_code}, Result: {result}")