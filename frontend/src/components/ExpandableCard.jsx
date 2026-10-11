import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/useOutsideClick";
import {
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Building2,
} from "lucide-react";

export default function ExpandableCard({
  programs = [],
  showMatchingScore = false,
}) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const uid = useId();

  const isRecommendation =
    active &&
    (active.fit_label ||
      active.reasoning ||
      active.reasons ||
      active.next_actions);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const formatEvidenceValue = (key, value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    if (
      [
        "min_academic_percent",
        "min_test_score",
      ].includes(key)
    ) {
      const numericValue = Number(value);

      if (!Number.isNaN(numericValue)) {
        return `${(numericValue * 100).toFixed(0)}%`;
      }
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  };

  const formatEvidenceKey = (key) => {
    return key
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 py-6">
            <motion.div
              layoutId={`card-${active.id}-${uid}`}
              ref={ref}
              className="w-full max-w-[650px] max-h-[90vh] bg-white rounded-3xl overflow-y-auto shadow-2xl"
            >
              <div className="p-6 space-y-6">

                {/* Header */}
                <div className="bg-[#a77cf3] rounded-2xl p-5">
                  <motion.h3
                    layoutId={`title-${active.id}-${uid}`}
                    className="font-bold text-white text-2xl"
                  >
                    {active.program_name ||
                      active.title ||
                      "Program"}
                  </motion.h3>

                  {active.university_name && (
                    <div className="flex items-center gap-2 mt-2 text-white/90">
                      <Building2 size={16} />

                      <span>
                        {active.university_name}
                      </span>
                    </div>
                  )}

                  {active.program_group && (
                    <p className="text-white/80 text-sm mt-1">
                      {active.program_group}
                    </p>
                  )}

                  {/* Labels */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">

                    {active.fit_label && (
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          active.fit_label === "Strong Fit"
                            ? "bg-green-100 text-green-700"
                            : active.fit_label === "Good Fit"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {active.fit_label}
                      </span>
                    )}

                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white">
                      Undergraduate
                    </span>
                  </div>
                </div>

                {/* Recommendation Reasoning */}
                {isRecommendation &&
                  active.reasoning && (
                    <div className="bg-[#f7f3ff] rounded-2xl p-5">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        Why this program?
                      </h4>

                      <p className="text-gray-700 leading-relaxed">
                        {active.reasoning}
                      </p>
                    </div>
                  )}

                {/* Reasons */}
                {isRecommendation &&
                  active.reasons?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2
                          size={20}
                          className="text-green-600"
                        />

                        <h4 className="text-lg font-bold text-gray-800">
                          Why it fits
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {active.reasons.map(
                          (reason, index) => (
                            <div
                              key={index}
                              className="flex gap-3 bg-green-50 rounded-xl p-3"
                            >
                              <span className="text-green-600 font-bold">
                                •
                              </span>

                              <p className="text-gray-700 text-sm">
                                {reason}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Concerns */}
                {isRecommendation &&
                  active.concerns?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle
                          size={20}
                          className="text-orange-500"
                        />

                        <h4 className="text-lg font-bold text-gray-800">
                          Things to consider
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {active.concerns.map(
                          (concern, index) => (
                            <div
                              key={index}
                              className="flex gap-3 bg-orange-50 rounded-xl p-3"
                            >
                              <span className="text-orange-500 font-bold">
                                •
                              </span>

                              <p className="text-gray-700 text-sm">
                                {concern}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Decision Factors */}
                {isRecommendation &&
                  active.decision_factors?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">
                        Important factors
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {active.decision_factors.map(
                          (factor, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 border border-gray-100 rounded-xl p-3"
                            >
                              <p className="text-sm text-gray-700">
                                {factor}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Next Actions */}
                {isRecommendation &&
                  active.next_actions?.length > 0 && (
                    <div className="bg-[#daf6c0] rounded-2xl p-5">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">
                        Next steps
                      </h4>

                      <div className="space-y-3">
                        {active.next_actions.map(
                          (action, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-0.5 bg-white rounded-full p-1">
                                <ArrowRight
                                  size={15}
                                  className="text-green-700"
                                />
                              </div>

                              <p className="text-sm text-gray-700">
                                {action}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Evidence */}
                {isRecommendation &&
                  active.evidence_fields &&
                  Object.keys(active.evidence_fields).length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">
                        Supporting information
                      </h4>

                      <div className="bg-[#d9f0fd] p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(
                          active.evidence_fields
                        ).map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-white border border-gray-100 rounded-xl p-4"
                          >
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              {formatEvidenceKey(key)}
                            </p>

                            <p className="text-gray-800 font-semibold mt-1">
                              {formatEvidenceValue(
                                key,
                                value
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* University */}
                {active.university && (
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      University
                    </h4>

                    <div className="bg-[#ebe0ff] p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {active.university.university_name && (
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-xs text-gray-500">
                            University
                          </p>

                          <p className="font-semibold text-gray-800 mt-1">
                            {active.university.university_name}
                          </p>
                        </div>
                      )}

                      {active.university.type && (
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-xs text-gray-500">
                            Type
                          </p>

                          <p className="font-semibold text-gray-800 mt-1">
                            {active.university.type}
                          </p>
                        </div>
                      )}

                      {active.university.city && (
                        <div className="bg-white rounded-xl p-3">
                          <div className="flex items-center gap-1">
                            <MapPin
                              size={13}
                              className="text-purple-500"
                            />

                            <p className="text-xs text-gray-500">
                              City
                            </p>
                          </div>

                          <p className="font-semibold text-gray-800 mt-1">
                            {active.university.city}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Existing University Details Program Features */}
                {active.features && (
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <h4 className="text-lg font-bold text-gray-800">
                      Program Details
                    </h4>

                    <div className="bg-[#E3FBCC] p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {active.features.credit_hours != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Credit Hours
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            {active.features.credit_hours}
                          </p>
                        </div>
                      )}

                      {active.features.fee_per_credit_hr != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Fee / Credit Hr
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            Rs{" "}
                            {active.features.fee_per_credit_hr}
                          </p>
                        </div>
                      )}

                      {active.features.semester_fee != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Semester Fee
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            Rs{" "}
                            {active.features.semester_fee}
                          </p>
                        </div>
                      )}

                      {active.features.admission_fee != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Admission Fee
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            Rs{" "}
                            {active.features.admission_fee}
                          </p>
                        </div>
                      )}

                      {active.features.entry_test_required != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Entry Test Required
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            {active.features.entry_test_required
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      )}

                      {active.features.min_academic_percent != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Min Academic %
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            {(
                              active.features
                                .min_academic_percent * 100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      )}

                      {active.features.min_test_score != null && (
                        <div className="bg-gray-50 shadow-sm rounded-xl p-3">
                          <span className="text-gray-500">
                            Min Test Score
                          </span>

                          <p className="font-semibold text-gray-800 mt-1">
                            {(
                              active.features.min_test_score * 100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <ul className="flex-1 grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4 w-full">
        {programs.map((card) => {
          const isActive = active?.id === card.id;

          const feature =
            card.university_program_features?.[0] ||
            card.features ||
            null;

          return (
            <motion.div
              key={`card-${card.id}`}
              layoutId={`card-${card.id}-${uid}`}
              onClick={() =>
                setActive({
                  ...card,

                  id: card.id,

                  program_name:
                    card.program_name ||
                    card.programs?.program_name ||
                    "Unknown Program",

                  university_name:
                    card.university_name ||
                    card.programs?.universities
                      ?.university_name ||
                    null,

                  university:
                    card.university ||
                    card.programs?.universities ||
                    null,

                  features: feature,
                })
              }
              style={{
                opacity: isActive ? 0 : 1,
              }}
              className="p-4 bg-white hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-200 hover:shadow-md transition-shadow flex justify-between"
            >
              <motion.div className="w-[90%]">

                <motion.h3
                  layoutId={`title-${card.id}-${uid}`}
                  className="font-bold text-lg text-gray-800 mb-2"
                >
                  {card.program_name}
                </motion.h3>

                {card.university_name && (
                  <p className="text-gray-500 text-sm mb-3">
                    {card.university_name}
                  </p>
                )}

                {/* Recommendation labels */}
                {(card.fit_label ||
                  card.program_name) && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">

                    {card.fit_label && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          card.fit_label === "Strong Fit"
                            ? "bg-green-100 text-green-700"
                            : card.fit_label === "Good Fit"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {card.fit_label}
                      </span>
                    )}

                    <motion.span
                      layoutId={`description-${card.id}-${uid}`}
                      className="text-white text-xs bg-[#B692F6] px-2.5 py-1 rounded-full"
                    >
                      Undergraduate
                    </motion.span>
                  </div>
                )}

                {/* Matching Score */}
                {showMatchingScore &&
                  card.similarity_score !== undefined && (
                    <div className="mt-1 mb-4">
                      <span className="text-purple-600 font-medium text-sm">
                        Matching Score:{" "}
                        {Math.round(
                          card.similarity_score * 100
                        )}
                        %
                      </span>

                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.round(
                              card.similarity_score * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
              </motion.div>

              <motion.div className="flex items-center gap-3">
                <MousePointerClick
                  size={30}
                  className="text-purple-500"
                />

                <motion.p className="text-gray-600 text-sm">
                  Click to see details
                </motion.p>
              </motion.div>
            </motion.div>
          );
        })}
      </ul>
    </>
  );
}