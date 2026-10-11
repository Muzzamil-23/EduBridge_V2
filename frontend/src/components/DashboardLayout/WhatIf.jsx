
import { useState } from "react";
import { supabase } from "../../supabase/config";
import Dropdown from "../Dropdown";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const WHAT_IF_STORAGE_KEY = "edubridge-what-if-scenario";

const initialChanges = {
    preferred_university_type: "",
    preferred_program_group: "",
    per_semester_budget: "",
    hostel_requirement: "",
    transport_requirement: "",
    entry_test_requirement: "",
    academic_percentage: "",
    specific_universities: "",
};

const universityTypes = ["Public", "Private"];

const programGroups = [
    "Computer Science & IT",
    "Engineering & Technology",
    "Business & Management",
    "Medical & Health Sciences",
    "Arts & Humanities",
    "Law & Legal Studies",
];

const booleanOptions = [
    "Keep current preference",
    "Yes",
    "No",
];

const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200";

function Field({ label, hint, children }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {children}

            {hint && (
                <p className="text-xs text-gray-500">{hint}</p>
            )}
        </div>
    );
}

function BooleanField({ label, value, onChange }) {
    const selectedValue =
        value === ""
            ? "Keep current preference"
            : value === "true"
                ? "Yes"
                : "No";

    return (
        <Field label={label}>
            <select
                className={inputClass}
                value={selectedValue}
                onChange={(event) => {
                    const selected = event.target.value;

                    onChange(
                        selected === "Keep current preference"
                            ? ""
                            : selected === "Yes"
                                ? "true"
                                : "false"
                    );
                }}
            >
                {booleanOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </Field>
    );
}

function RecommendationCard({ recommendation, index }) {
    const program = recommendation?.programs || {};

    const university =
        program?.universities ||
        recommendation?.university ||
        {};

    const programName =
        (typeof recommendation?.program === "string"
            ? recommendation.program
            : null) ||
        program?.program_name ||
        recommendation?.program_name ||
        recommendation?.Program ||
        recommendation?.name ||
        `Recommendation ${index + 1}`;

    const universityName =
        (typeof recommendation?.university === "string"
            ? recommendation.university
            : null) ||
        university?.university_name ||
        university?.name ||
        recommendation?.university_name ||
        recommendation?.University ||
        "University not specified";

    const city =
        university?.city ||
        recommendation?.city ||
        "";

    const fitLabel =
        recommendation?.fit_label || "Recommended";

    const reasons = Array.isArray(recommendation?.reasons)
        ? recommendation.reasons
        : [];

    const concerns = Array.isArray(recommendation?.concerns)
        ? recommendation.concerns
        : [];

    const nextActions = Array.isArray(recommendation?.next_actions)
        ? recommendation.next_actions
        : [];

    const renderItem = (item) =>
        typeof item === "string"
            ? item
            : item?.description ||
            item?.reason ||
            item?.action ||
            JSON.stringify(item);

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    {city && (
                        <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                            {city}
                        </p>
                    )}

                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                        {programName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {universityName}
                    </p>
                </div>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    {fitLabel}
                </span>
            </div>

            {recommendation?.reasoning && (
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    {recommendation.reasoning}
                </p>
            )}

            {reasons.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800">
                        Why it may fit
                    </h4>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {reasons.map((item, i) => (
                            <li key={i}>{renderItem(item)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {concerns.length > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3">
                    <h4 className="text-sm font-semibold text-amber-800">
                        Things to consider
                    </h4>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
                        {concerns.map((item, i) => (
                            <li key={i}>{renderItem(item)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {nextActions.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800">
                        Suggested next steps
                    </h4>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {nextActions.map((item, i) => (
                            <li key={i}>{renderItem(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}

export default function WhatIf() {
    const [changes, setChanges] = useState(initialChanges);

    const [savedScenario, setSavedScenario] = useState(() => {
        try {
            const saved = sessionStorage.getItem(WHAT_IF_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [recommendations, setRecommendations] = useState(
        () => savedScenario?.recommendations || []
    );

    const [hasRun, setHasRun] = useState(
        () => Boolean(savedScenario)
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateField = (field, value) => {
        setChanges((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setChanges({ ...initialChanges });
        setError("");
    };

    const clearScenario = () => {
        sessionStorage.removeItem(WHAT_IF_STORAGE_KEY);
        setSavedScenario(null);
        setRecommendations([]);
        setHasRun(false);
        setError("");
    };

    const generateScenario = async (event) => {
        event.preventDefault();
        setError("");

        const payloadChanges = {};

        Object.entries(changes).forEach(([key, value]) => {
            if (value === "") return;

            if (
                key === "per_semester_budget" ||
                key === "academic_percentage"
            ) {
                const numberValue = Number(value);

                if (Number.isFinite(numberValue)) {
                    payloadChanges[key] = numberValue;
                }
            } else if (
                key === "hostel_requirement" ||
                key === "transport_requirement" ||
                key === "entry_test_requirement"
            ) {
                payloadChanges[key] = value === "true";
            } else {
                const textValue = value.trim();

                if (textValue) {
                    payloadChanges[key] = textValue;
                }
            }
        });

        if (Object.keys(payloadChanges).length === 0) {
            setError(
                "Please change at least one field before generating a scenario."
            );
            return;
        }

        if (
            payloadChanges.per_semester_budget !== undefined &&
            payloadChanges.per_semester_budget < 0
        ) {
            setError("Budget cannot be negative.");
            return;
        }

        if (
            payloadChanges.academic_percentage !== undefined &&
            (payloadChanges.academic_percentage < 0 ||
                payloadChanges.academic_percentage > 100)
        ) {
            setError("Academic percentage must be between 0 and 100.");
            return;
        }

        setLoading(true);

        try {
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            const accessToken = sessionData?.session?.access_token;

            if (!accessToken) {
                throw new Error(
                    "Your session has expired. Please sign in again."
                );
            }

            const response = await fetch(`${API_URL}/what-if`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    changes: payloadChanges,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    typeof data?.detail === "string"
                        ? data.detail
                        : "Unable to generate What-If recommendations."
                );
            }

            const nextRecommendations = Array.isArray(
                data?.recommendations
            )
                ? data.recommendations
                : [];

            const nextScenario = {
                changes: payloadChanges,
                recommendations: nextRecommendations,
                generatedAt: new Date().toISOString(),
            };

            sessionStorage.setItem(
                WHAT_IF_STORAGE_KEY,
                JSON.stringify(nextScenario)
            );

            setSavedScenario(nextScenario);
            setRecommendations(nextRecommendations);
            setHasRun(true);
        } catch (err) {
            setError(
                err.message ||
                "Something went wrong while generating your scenario."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <header>
                <p className="text-sm font-medium text-purple-600">
                    Explore your options
                </p>
                <div className="flex gap-2 mt-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4776/4776202.png"
                        alt="scholarship-icon"
                        className="w-10 h-10"
                    />
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        What-If Analysis
                    </h1>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                    Try changing your academic details or university preferences
                    to see how your options may change. These changes are temporary
                    and won't update your saved profile.
                </p>
            </header>

            <form
                onSubmit={generateScenario}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
            >
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Customize your scenario
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Leave any field unchanged if you don't want to test it.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Dropdown
                        label="Preferred University Type"
                        options={universityTypes}
                        selected={changes.preferred_university_type}
                        onChange={(value) =>
                            updateField("preferred_university_type", value)
                        }
                    />

                    <Dropdown
                        label="Preferred Program Group"
                        options={programGroups}
                        selected={changes.preferred_program_group}
                        onChange={(value) =>
                            updateField("preferred_program_group", value)
                        }
                    />

                    <Field
                        label="Per Semester Budget (Rs.)"
                        hint="Enter the maximum fee you want to consider."
                    >
                        <input
                            type="number"
                            min="0"
                            step="any"
                            className={inputClass}
                            value={changes.per_semester_budget}
                            onChange={(event) =>
                                updateField("per_semester_budget", event.target.value)
                            }
                            placeholder="e.g. 100000"
                        />
                    </Field>

                    <Field label="Academic Percentage">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            className={inputClass}
                            value={changes.academic_percentage}
                            onChange={(event) =>
                                updateField("academic_percentage", event.target.value)
                            }
                            placeholder="e.g. 85"
                        />
                    </Field>

                    <BooleanField
                        label="Hostel Requirement"
                        value={changes.hostel_requirement}
                        onChange={(value) =>
                            updateField("hostel_requirement", value)
                        }
                    />

                    <BooleanField
                        label="Transport Requirement"
                        value={changes.transport_requirement}
                        onChange={(value) =>
                            updateField("transport_requirement", value)
                        }
                    />

                    <BooleanField
                        label="Entry Test Requirement"
                        value={changes.entry_test_requirement}
                        onChange={(value) =>
                            updateField("entry_test_requirement", value)
                        }
                    />

                    <Field
                        label="Specific Universities"
                        hint="Enter names as expected by your backend."
                    >
                        <input
                            type="text"
                            className={inputClass}
                            value={changes.specific_universities}
                            onChange={(event) =>
                                updateField("specific_universities", event.target.value)
                            }
                            placeholder="e.g. FAST, NED, IBA"
                        />
                    </Field>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Generating scenario..." : "Generate scenario"}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        Reset form
                    </button>
                </div>
            </form>

            {loading && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

                    <p className="mt-3 text-sm font-medium text-purple-800">
                        Exploring recommendations for your new scenario...
                    </p>
                </div>
            )}

            {hasRun && !loading && (
                <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Scenario Results
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                These results reflect your temporary changes.
                            </p>

                            {savedScenario?.generatedAt && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Generated{" "}
                                    {new Date(savedScenario.generatedAt).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={clearScenario}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Clear scenario
                        </button>
                    </div>

                    {recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {recommendations.map((recommendation, index) => (
                                <RecommendationCard
                                    key={
                                        recommendation.id ??
                                        recommendation.program_id ??
                                        index
                                    }
                                    recommendation={recommendation}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                            <h3 className="font-semibold text-gray-900">
                                No recommendations returned
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Try adjusting your scenario and generating results again.
                            </p>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
