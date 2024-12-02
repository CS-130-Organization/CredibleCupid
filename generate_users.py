import requests
import random
import time
import os
import calendar
from datetime import datetime

# Function to print error messages in red using ANSI escape sequences
def print_red(message):
    print("\033[91m" + message + "\033[0m")

# List of cat-themed names for users
cat_names_male = [
    "Whiskers", "Fluffy", "Shadow", "Simba", "Mittens", "Mr. Paws", "Tigger", "Oliver", "Leo", "Tiger"
]
cat_names_female = [
    "Misty", "Luna", "Cleo", "Bella", "Chloe", "Nala", "Peaches", "Olive", "Sasha", "Zoe"
]

def get_random_user_data(gender):
    response = requests.get(f"https://randomuser.me/api/?gender={gender}")
    if response.status_code == 200:
        user_info = response.json()['results'][0]
        
        # Assign cat-themed first and last names
        if gender == "Female":
            first_name = random.choice(cat_names_female)
        else:
            first_name = random.choice(cat_names_male)
        
        last_name = random.choice(["Cat", "Whiskers", "Paws", "Furr", "Claw", "Tail", "Mew", "Kitten"])
        
        email = user_info['email']
        gender = "Male" if user_info['gender'] == 'male' else "Female"
        
        # Generate random age between 18 and 30
        age = random.randint(18, 30)
        current_year = datetime.now().year
        
        # Calculate birth year and generate the date of birth
        birth_year = current_year - age
        birth_month = random.randint(1, 12)
        birth_day = random.randint(1, 28)  # Ensures the day is valid for all months
        
        dob_datetime = datetime(birth_year, birth_month, birth_day)
        
        # Convert to timestamp in milliseconds
        birthday_ms_since_epoch = int(calendar.timegm(dob_datetime.timetuple()) * 1000)
        
        # Use placecats.com for profile images instead of Avataaars API
        avatar_url = f"https://placecats.com/{random.randint(128, 1024)}/{random.randint(128, 1024)}"

        # Map gender to cat-like pronouns
        pronouns = "Meow/Mew" if gender == "Male" else "Purr/Paw"
        
        # Cat-themed bio with more variety
        bio = random.choice([
            "A purrfect mix of curiosity and cuddles. Lover of sunbeams, purring, and chasing strings.",
            "Mysterious, playful, and always looking for the next nap spot. Will work for treats.",
            "Fluffy and fabulous. My hobbies include knocking things off shelves and napping in strange places.",
            "I’m a professional purrer and napper. My favorite pastimes include watching birds and running away from the vacuum.",
            "The queen of my castle, with a penchant for purring and chasing after anything that moves.",
            "A fluffy bundle of joy who loves to snuggle, nap in the sun, and occasionally cause some mischief.",
            "Fluff, purr, repeat. I’m not just a cat—I’m a lifestyle. Swipe right if you believe in treats!",
            "I’m not just a pretty face. I’ve mastered the art of the purr and the perfect paw stretch."
        ])
        
        return {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "bio": bio,
            "gender": gender,
            "pronouns": pronouns,
            "sexual_orientation": random.choice(["Straight", "Gay", "Bisexual"]),
            "birthday_ms_since_epoch": birthday_ms_since_epoch,
            "height_mm": random.randint(1500, 2000),  # still random but could be fun to associate with 'cat size'
            "occupation": random.choice(["Professional Napper", "Chief Purring Officer", "Laser Pointer Expert", "Feline Fashionista", "Mischief Manager"]),
            "avatar_url": avatar_url
        }
    return None

def download_profile_picture(picture_url):
    response = requests.get(picture_url)
    if response.status_code == 200:
        image_path = "/tmp/profile_picture.png"
        with open(image_path, "wb") as file:
            file.write(response.content)
        return image_path
    else:
        print_red(f"Error: Failed to download profile picture from {picture_url}. Status Code: {response.status_code}, Response: {response.text}")
    return None

def upload_profile_picture(jwt, image_path):
    upload_url = "http://localhost:8000/user/upload_profile_picture"
    headers = {
        "accept": "*/*",
        "Authorization": f"Bearer {jwt}"
    }
    
    with open(image_path, "rb") as image_file:
        files = {"file": (os.path.basename(image_path), image_file, "image/png")}
        response = requests.post(upload_url, headers=headers, files=files)
    
    # Check if the response is valid, but don't try to parse JSON
    if response.status_code == 201:
        print(f"Profile picture uploaded successfully. Status Code: {response.status_code}")
        return response.status_code, response.text
    else:
        print_red(f"Error: Failed to upload profile picture. Status Code: {response.status_code}, Response: {response.text}")
        return response.status_code, response.text

def send_referral(jwt, referral_email):
    referral_url = "http://localhost:8000/referral/send_referral"
    headers = {
        "accept": "*/*",
        "Authorization": f"Bearer {jwt}",
        "Content-Type": "application/json"
    }
    referral_data = {
        "email": referral_email,
        "message": "Purrfect match! Come join the paw-ty!"
    }
    response = requests.post(referral_url, headers=headers, json=referral_data)
    if response.status_code == 201:
        print(f"Referral sent successfully to {referral_email}. Status Code: {response.status_code}")
    else:
        print_red(f"Error: Failed to send referral. Status Code: {response.status_code}, Response: {response.text}")

# Global variables to track referrals
referrals_for_males = {}

def create_user(female_users, male_users):
    signup_url = "http://localhost:8000/auth/signup"
    update_bio_url = "http://localhost:8000/user/update_bio"
    
    user_data = get_random_user_data(gender="Female")
    if user_data:
        signup_data = {
            "email": user_data["email"],
            "password": "password"
        }
        
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
        
        # Step 1: Sign up and retrieve JWT for female users
        response = requests.post(signup_url, headers=headers, json=signup_data)
        
        # Debug: Check the response status and content
        print(f"Signup Response: Status Code = {response.status_code}, Response Text = {response.text}")
        
        if response.status_code == 201:
            female_jwt = response.json()['jwt']
            female_email = user_data["email"]
            
            # Step 2: Send referrals from female user to male users
            for male_user in male_users:
                send_referral(female_jwt, male_user["email"])
            
            # Add female user to the list for later use
            female_users.append({
                "email": female_email,
                "jwt": female_jwt
            })
            
            # Download and upload profile picture for the female user
            image_path = download_profile_picture(user_data["avatar_url"])
            if image_path:
                upload_profile_picture(female_jwt, image_path)
                os.remove(image_path)  # Clean up the downloaded file
        else:
            print_red(f"Error: Failed to sign up female user. Status Code: {response.status_code}, Response: {response.text}")
                
    else:
        print_red("Error: Failed to get random user data.")

def create_male_user(male_users, female_users):
    signup_url = "http://localhost:8000/auth/signup"
    update_bio_url = "http://localhost:8000/user/update_bio"
    
    male_user_data = get_random_user_data(gender="Male")
    if male_user_data:
        male_signup_data = {
            "email": male_user_data["email"],
            "password": "password"
        }
        
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
        
        # Step 3: Sign up the male user
        response = requests.post(signup_url, headers=headers, json=male_signup_data)
        
        # Debug: Check the response status and content
        print(f"Signup Response: Status Code = {response.status_code}, Response Text = {response.text}")
        
        if response.status_code == 201:
            male_jwt = response.json()['jwt']
            male_email = male_user_data["email"]
            
            # Keep track of the number of referrals for this male user
            referrals_for_males[male_email] = 0

            # Step 4: Send referrals from female users to this male user
            for female_user in female_users:
                send_referral(female_user["jwt"], male_email)
                referrals_for_males[male_email] += 1
                
                if referrals_for_males[male_email] >= 3:
                    # Step 5: Allow bio update for the male user after receiving 3 referrals
                    bio_data = {
                        "first_name": male_user_data["first_name"],
                        "last_name": male_user_data["last_name"],
                        "bio": male_user_data["bio"],
                        "gender": male_user_data["gender"],
                        "pronouns": male_user_data["pronouns"],
                        "sexual_orientation": male_user_data["sexual_orientation"],
                        "birthday_ms_since_epoch": male_user_data["birthday_ms_since_epoch"],
                        "height_mm": male_user_data["height_mm"],
                        "occupation": male_user_data["occupation"]
                    }
                    
                    # Update bio with the correct JWT (male_jwt)
                    bio_headers = {
                        "Authorization": f"Bearer {male_jwt}",
                        "Content-Type": "application/json"
                    }
                    
                    response = requests.post(update_bio_url, headers=bio_headers, json=bio_data)
                    if response.status_code == 201:
                        print(f"Bio updated successfully for {male_email}.")
                    else:
                        print_red(f"Error: Failed to update bio. Status Code: {response.status_code}, Response: {response.text}")
                    
                    # Step 6: Download and upload profile picture
                    image_path = download_profile_picture(male_user_data["avatar_url"])
                    if image_path:
                        upload_profile_picture(male_jwt, image_path)
                        os.remove(image_path)  # Clean up the downloaded file
                    else:
                        print_red("Failed to save profile picture!")
                else:
                    print_red(f"Error: Male user does not have enough referrals. Required: 3, Found: {referrals_for_males[male_email]}")
        else:
            print_red(f"Error: Failed to sign up male user. Status Code: {response.status_code}, Response: {response.text}")
    else:
        print_red("Error: Failed to get random male user data.")

# Initialize lists to hold the female and male users
female_users = []
male_users = []

# Generate 3 female users first
for _ in range(15):  # Adjust number of female users to sign up first
    create_user(female_users, male_users)

# Generate male users after the female users
for _ in range(5):  # Adjust number of male users after referrals are sent
    create_male_user(male_users, female_users)