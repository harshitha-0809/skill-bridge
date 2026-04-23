import requests

# Test the recommendations API
# First, let's try without auth to see if it fails properly
response = requests.get("http://localhost:8000/api/programs/recommendations")
print("Without auth:", response.status_code, response.text)

# Try with invalid token
headers = {"Authorization": "Bearer invalid"}
response = requests.get("http://localhost:8000/api/programs/recommendations", headers=headers)
print("With invalid token:", response.status_code, response.text)