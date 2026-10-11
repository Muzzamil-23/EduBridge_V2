# from app.services.advisor.classifier import IntentClassifier
# from app.services.advisor.evidence import EvidenceGate
# from app.services.advisor.retrieval import AdvisorRetrievalService


# classifier = IntentClassifier()
# retrieval_service = AdvisorRetrievalService()
# evidence_gate = EvidenceGate()


# test_queries = [
#     # Clearly relevant
#     "What bachelor's programs are available at FAST?",
#     "What is the semester fee for BSCS?",
#     "Does this university provide hostel facilities?",
#     "What scholarships are available?",
#     "Can I get admission with 72% marks?",
#     "Which universities offer computer science in Karachi?",
#     "What programs does NED offer?",
#     "Tell me about FAST.",

#     # Borderline / student guidance
#     "Which degree should I choose for AI?",
#     "I want to study computer science.",
#     "I have a limited budget, what should I consider?",
#     "How do I learn machine learning?",

#     # Clearly unrelated
#     "Write Python code for me.",
#     "Solve this DSA problem.",
#     "Tell me a joke.",
#     "What's the weather today?",
#     "Who won the cricket match?",
#     "Help me build an e-commerce website.",
#     "How do I cook biryani?",
#     "Tell me about the history of Pakistan.",
# ]


# for query in test_queries:

#     intent, intent_similarity = classifier.classify(query)

#     results = retrieval_service.search(
#         query=query,
#         intent=intent,
#         match_count=5,
#     )

#     has_evidence = evidence_gate.has_sufficient_evidence(
#         results
#     )

#     print(
#         f"\nQuery: {query}"
#         f"\nIntent: {intent}"
#         f"\nIntent similarity: {intent_similarity:.4f}"
#     )

#     if not results:
#         print("No retrieval results")
#     else:
#         for index, result in enumerate(results, start=1):
#             print(
#                 f"{index}. "
#                 f"{result.entity_type}:{result.entity_id} "
#                 f"similarity={result.similarity:.4f}"
#             )

#     print(
#         f"Evidence sufficient: {has_evidence}"
#     )