import os

from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

from app.models.place import Place


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)



def chat_with_ai(
    db: Session,
    message: str
):


    places = db.query(Place).all()



    if not places:

        return {

            "reply":
            "Currently no tourism places are available in the database."

        }





    place_info = ""



    for place in places:


        place_info += f"""

Name: {place.name}

Location: {place.location}

Category: {place.category}

Description: {place.description}


"""






    prompt = f"""

You are an AI Tourism Assistant for Pakistan.

Your job is to help users plan trips and explore tourism places.

Use ONLY the tourism data provided below.

IMPORTANT RESPONSE FORMAT RULES:

- Always use proper headings.
- Use emojis when suitable.
- Use bullet points.
- Add empty lines between sections.
- Never write the whole answer in one paragraph.
- For trip planning requests, create a day-wise itinerary.
- Include:
  * Location
  * Category
  * Description
  * Activities
  * Travel tips
- Keep the answer professional and easy to read.



Example format:


🌍 Trip Plan


📅 Day 1: Place Name

📍 Location:
...

🏛️ Category:
...

Details:
...

Things to do:
✅ ...
✅ ...


━━━━━━━━━━━━━━


Travel Tips:
• ...
• ...



Tourism Database:

{place_info}



User Question:

{message}

"""






    try:


        response = client.models.generate_content(

            model="gemini-flash-latest",

            contents=prompt

        )



        return {

            "reply": response.text

        }





    except Exception as e:


        return {

            "error": str(e)

        }