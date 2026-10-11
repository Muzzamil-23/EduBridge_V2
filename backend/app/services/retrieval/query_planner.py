
import re

from app.schemas.query import QueryPlan, RetrievalMode


class QueryPlanner:
    def plan(self, query: str) -> QueryPlan:
        if not query.strip():
            raise ValueError("Query cannot be empty.")

        query_lower = query.lower()

        has_filter_signal = any(
            keyword in query_lower
            for keyword in [
                "under",
                "below",
                "less than",
                "maximum",
                "max",
                "fee",
                "fees",
                "affordable",
                "budget",
                "in karachi",
                "in lahore",
                "in islamabad",
            ]
        )

        has_semantic_signal = any(
            keyword in query_lower
            for keyword in [
                "why",
                "how",
                "difference",
                "explain",
                "suitable",
                "good for",
                "should i",
                "recommend",
                "best",
                "compare",
                "comparison",
                "tell me about",
                "information about",
            ]
        )

        university_name = self._extract_university_name(query_lower)
        program_name = self._extract_program_name(query_lower)

        if university_name and has_semantic_signal:
            mode = RetrievalMode.HYBRID
        elif university_name:
            mode = RetrievalMode.STRUCTURED
        elif has_filter_signal and (has_semantic_signal or program_name):
            mode = RetrievalMode.HYBRID
        elif has_filter_signal:
            mode = RetrievalMode.STRUCTURED
        else:
            mode = RetrievalMode.SEMANTIC

        return QueryPlan(
            mode=mode,
            search_query=query,
            university_name=university_name,
            city=self._extract_city(query_lower),
            program_name=program_name,
            max_fee=self._extract_max_fee(query_lower),
        )

    @staticmethod
    def _extract_city(query: str) -> str | None:
        cities = {
            "karachi": "Karachi",
            "lahore": "Lahore",
            "islamabad": "Islamabad",
        }

        for key, value in cities.items():
            if key in query:
                return value

        return None

    @staticmethod
    def _extract_university_name(query: str) -> str | None:
        universities = {
            "fast": "FAST",
            "fast-nuces": "FAST",
            "fast national university": "FAST",
            "ned university of engineering": "NED",
            "ned university": "NED",
            "ned": "NED",
            "university of karachi": "University of Karachi",
            "uok": "University of Karachi",
            "bahria university": "Bahria University",
            "institute of business administration": "IBA",
            "iba": "IBA",
            "szabist": "SZABIST",
            "iqra university": "Iqra University",
            "habib university": "Habib University",
            "sir syed university": "Sir Syed University",
        }

        for name in sorted(universities, key=len, reverse=True):
            if re.search(
                rf"(?<!\w){re.escape(name)}(?!\w)",
                query,
            ):
                return universities[name]

        return None

    @staticmethod
    def _extract_program_name(query: str) -> str | None:
        programs = {
            "computer science": "Computer Science",
            "software engineering": "Software Engineering",
            "artificial intelligence": "Artificial Intelligence",
            "data science": "Data Science",
            "information technology": "Information Technology",
            "business administration": "Business Administration",
            "accounting": "Accounting",
            "finance": "Finance",
        }

        for key, value in programs.items():
            if key in query:
                return value

        return None


    @staticmethod
    def _extract_max_fee(query: str) -> int | None:
        patterns = [
            r"(?:under|below|less than|maximum|max)\s*(?:rs\.?|pkr)?\s*([\d,]+)\s*(k|thousand|lac|lakh)?",
            r"(?:fee|fees|budget)\s*(?:of|is|around)?\s*(?:rs\.?|pkr)?\s*([\d,]+)\s*(k|thousand|lac|lakh)?",
        ]

        for pattern in patterns:
            match = re.search(pattern, query)

            if not match:
                continue

            amount_text = match.group(1).replace(",", "").strip()

            if not amount_text:
                continue

            try:
                amount = int(amount_text)
            except ValueError:
                continue

            unit = match.group(2)

            if unit in ("k", "thousand"):
                amount *= 1_000
            elif unit in ("lac", "lakh"):
                amount *= 100_000

            return amount

        return None

