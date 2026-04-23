from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from typing import List, Dict
from app.models.program import Program
from app.models.user import User
from sqlalchemy.orm import Session

def get_program_recommendations(user: User, db: Session, top_n: int = 5) -> List[Dict]:
    """
    Recommend programs to a user based on their enrolled programs' skills using content-based filtering.
    """
    # Get all programs
    all_programs = db.query(Program).all()

    if not all_programs:
        return []

    # Get user's enrolled programs
    enrolled_program_ids = [e.program_id for e in user.enrollments]
    enrolled_programs = [p for p in all_programs if p.id in enrolled_program_ids]

    if not enrolled_programs:
        # If no enrollments, recommend based on department or general popularity
        # For simplicity, return top programs by enrollment count
        from sqlalchemy import func
        from app.models.program import Enrollment
        top_programs = (
            db.query(Program, func.count(Enrollment.id).label("enrollment_count"))
            .outerjoin(Enrollment)
            .group_by(Program.id)
            .order_by(func.count(Enrollment.id).desc())
            .limit(top_n)
            .all()
        )
        return [{"program": prog, "score": count} for prog, count in top_programs]

    # Create feature vectors from skills
    program_features = []
    for prog in all_programs:
        features = " ".join(prog.skills or []) + " " + (prog.category or "") + " " + prog.difficulty.value
        program_features.append(features.lower())

    # Vectorize
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(program_features)

    # Get user's profile vector (average of enrolled programs)
    enrolled_indices = [i for i, p in enumerate(all_programs) if p.id in enrolled_program_ids]
    if enrolled_indices:
        user_vector = tfidf_matrix[enrolled_indices].mean(axis=0)
    else:
        user_vector = tfidf_matrix.mean(axis=0)  # fallback

    # Compute similarities
    similarities = cosine_similarity(user_vector, tfidf_matrix).flatten()

    # Get top recommendations (exclude already enrolled)
    recommendations = []
    for idx, score in sorted(enumerate(similarities), key=lambda x: x[1], reverse=True):
        prog = all_programs[idx]
        if prog.id not in enrolled_program_ids and score > 0:
            recommendations.append({"program": prog, "score": round(float(score), 3)})
            if len(recommendations) >= top_n:
                break

    return recommendations