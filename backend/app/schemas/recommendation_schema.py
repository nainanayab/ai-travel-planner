from pydantic import BaseModel


class RecommendationResponse(BaseModel):

    id: int
    name: str
    location: str
    category: str
    description: str
    average_rating: float
    total_reviews: int
    score: int