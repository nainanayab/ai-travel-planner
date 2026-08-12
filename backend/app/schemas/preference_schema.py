from pydantic import BaseModel


class PreferenceCreate(BaseModel):

    category: str

    location: str | None = None