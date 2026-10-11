import React from "react";
import FallingText from "./reactbits/TextAnimations/FallingText/FallingText";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Tagline */}
      <span className="text-sm bg-[#d0f9e4] border border-[#aef9d2] px-4 py-2 rounded-full mb-5 text-[var(--muted)] shadow-card">
        🎓 Smarter guidance for your university journey
      </span>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl md:leading-16 font-bold max-w-3xl leading-tight">
        A platform that helps you{" "}
        <span className="gradient-text">choose smarter</span>, not just{" "}
        <span className="gradient-text">apply faster</span>.
      </h1>

      {/* Description */}
      <p className="mt-6 text-lg max-w-2xl text-[var(--secondary)]">
        Discover your best-fit university through AI-powered analysis, personalized
        recommendations, and real-time admission insights.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-4 mb-20">
        <button className="btn-primary cursor-pointer" onClick={() => navigate("/student-dashboard")}>Find My Match</button>
        <button className="btn-outline">Learn More</button>
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <FallingText
          text={`AI-powered university match smart filtering real-time admission insights program comparison match scoring admission trends`}
          highlightWords={[
            "AI-powered",
            "university",
            "match",
            "smart",
            "filtering",
            "real-time", 
            "admission" ,
            "insights",
            "program", 
            "comparison",
            "match", 
            "scoring",
            "admission", 
            "trends"
          ]}
          highlightClass="highlighted"
          trigger="auto"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.25}           // slower, smooth fall
          fontSize="1.5rem"           // big
          mouseConstraintStiffness={0.8}
        />
      </div>
    </section>
  );
};

export default HeroSection;
