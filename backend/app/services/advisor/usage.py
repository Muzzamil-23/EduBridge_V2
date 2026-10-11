from datetime import date

from app.core.config import settings
from app.repositories.advisor_usage import AdvisorUsageRepository


class AdvisorUsageService:

    def __init__(self):
        self.repository = AdvisorUsageRepository()

    def check_and_increment(self, user_id: str) -> int:
        today = date.today()

        current_usage = self.repository.get_usage(
            user_id=user_id,
            usage_date=today,
        )

        if current_usage >= settings.advisor_daily_limit:
            raise ValueError(
                "Daily Advisor message limit reached."
            )

        return self.repository.increment_usage(
            user_id=user_id,
            usage_date=today,
        )