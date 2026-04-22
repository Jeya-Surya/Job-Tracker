import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getApplicationById } from "../../api/applicationApi";
import "./InterviewCoach.css";

function extractGeminiText(data) {
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
        .map((part) => part?.text)
        .filter(Boolean)
        .join("\n")
        .trim();

    if (text) return text;

    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
        throw new Error(`Generation blocked: ${blockReason}`);
    }

    throw new Error("AI response was empty. Please try again.");
}

function parseCoachingJson(rawText) {
    const clean = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    const jsonText = start !== -1 && end !== -1 ? clean.slice(start, end + 1) : clean;

    const parsed = JSON.parse(jsonText);

    if (!parsed?.overview || !Array.isArray(parsed?.technicalQuestions) || !Array.isArray(parsed?.hrQuestions)) {
        throw new Error("AI returned an unexpected format. Please regenerate.");
    }

    return parsed;
}

function parseRetryAfterSeconds(message) {
    const match = message?.match(/retry\s+in\s+([\d.]+)s/i);
    if (!match) return 0;

    const seconds = Math.ceil(Number(match[1]));
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

export default function InterviewCoach() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isInvalidId = !id;

    const [application, setApplication] = useState(null);
    const [coaching, setCoaching]       = useState(null);
    const [loading, setLoading]         = useState(false);
    const [fetching, setFetching]       = useState(!isInvalidId);
    const [error, setError]             = useState("");
    const [retryIn, setRetryIn]         = useState(0);
    const displayError = error || (isInvalidId ? "Invalid application id." : "");

    const fetchApplication = useCallback(async () => {
        try {
            setFetching(true);
            setError("");
            const data = await getApplicationById(id);
            setApplication(data);
        } catch {
            setError("Failed to load application!");
        } finally {
            setFetching(false);
        }
    }, [id]);

    useEffect(() => {
        if (!isInvalidId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchApplication();
        }
    }, [fetchApplication, isInvalidId]);

    useEffect(() => {
        if (retryIn <= 0) return;

        const timer = setInterval(() => {
            setRetryIn((prev) => (prev > 1 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [retryIn]);

    const generateCoaching = async () => {
        setLoading(true);
        setError("");
        setCoaching(null);

        const prompt = `
You are an expert interview coach helping a fresher prepare for a job interview.

Company: ${application.companyName}
Role: ${application.role}
Location: ${application.location || "India"}

Generate a structured interview preparation guide in the following EXACT JSON format (no markdown, no backticks, pure JSON only):

{
  "overview": "2-3 sentence overview of what to expect in this interview",
  "technicalQuestions": [
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" }
  ],
  "hrQuestions": [
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" },
    { "question": "question text", "tip": "how to answer this" }
  ],
  "companyTips": [
    "specific tip about this company",
    "specific tip about this company",
    "specific tip about this company"
  ],
  "checklist": [
    "preparation item",
    "preparation item",
    "preparation item",
    "preparation item",
    "preparation item"
  ]
}`;

        try {
            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                        temperature: 0.7,
                    }),
                }
            );

            const data = await response.json();
            console.log("Groq response:", data);

            // Extract text from Groq response
            const text = data.choices[0].message.content;

            // Clean markdown if any
            const clean = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const parsed = JSON.parse(clean);
            setCoaching(parsed);

        } catch (err) {
            console.error("Groq error:", err);
            setError("Failed to generate coaching. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Layout>
                <div className="loading-screen">
                    <div className="loader" />
                    <p>Loading application...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="coach-page">

                {/* Header */}
                <div className="coach-header">
                    <div>
                        <h2 className="page-title"> AI Interview Coach</h2>
                        <p className="page-subtitle">
                            Personalized preparation for your interview
                        </p>
                    </div>
                    <button className="back-btn" onClick={() => navigate("/applications")}>
                        ← Back
                    </button>
                </div>

                {/* Application Info Card */}
                {application && (
                    <div className="app-info-card">
                        <div className="app-info-left">
                            <div className="company-avatar-lg">
                                {application.companyName.charAt(0)}
                            </div>
                            <div>
                                <div className="app-company">{application.companyName}</div>
                                <div className="app-role">{application.role}</div>
                                <div className="app-location">
                                     {application.location || "India"}
                                </div>
                            </div>
                        </div>
                        <button
                            className="generate-btn"
                            onClick={generateCoaching}
                            disabled={loading || retryIn > 0}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-loader" />
                                    Generating...
                                </>
                            ) : retryIn > 0 ? (
                                <>Retry in {retryIn}s</>
                            ) : (
                                <>✨ {coaching ? "Regenerate" : "Generate Prep Guide"}</>
                            )}
                        </button>
                    </div>
                )}

                {/* Error */}
                {displayError && <div className="error-msg">{displayError}</div>}

                {/* Loading State */}
                {loading && (
                    <div className="ai-loading">
                        <div className="ai-loader-wrap">
                            <div className="ai-pulse" />
                            <div className="ai-loading-text">
                                <div className="ai-loading-title">
                                    AI is preparing your guide...
                                </div>
                                <div className="ai-loading-sub">
                                    Analyzing {application?.companyName} interview patterns 
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coaching Content */}
                {coaching && !loading && (
                    <div className="coaching-content">

                        {/* Overview */}
                        <div className="coaching-card">
                            <div className="coaching-card-title">
                                 Interview Overview
                            </div>
                            <p className="overview-text">{coaching.overview}</p>
                        </div>

                        {/* Two Column Layout */}
                        <div className="coaching-grid">

                            {/* Technical Questions */}
                            <div className="coaching-card">
                                <div className="coaching-card-title">
                                     Technical Questions
                                </div>
                                <div className="questions-list">
                                    {coaching.technicalQuestions?.map((q, i) => (
                                        <div key={i} className="question-item">
                                            <div className="question-number">{i + 1}</div>
                                            <div className="question-content">
                                                <div className="question-text">{q.question}</div>
                                                <div className="question-tip">
                                                     {q.tip}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* HR Questions */}
                            <div className="coaching-card">
                                <div className="coaching-card-title">
                                     HR Questions
                                </div>
                                <div className="questions-list">
                                    {coaching.hrQuestions?.map((q, i) => (
                                        <div key={i} className="question-item">
                                            <div className="question-number"
                                                 style={{ background: "#a78bfa20", color: "#a78bfa" }}>
                                                {i + 1}
                                            </div>
                                            <div className="question-content">
                                                <div className="question-text">{q.question}</div>
                                                <div className="question-tip"
                                                     style={{ borderLeft: "3px solid #a78bfa50" }}>
                                                     {q.tip}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Company Tips */}
                                <div className="coaching-card-title" style={{ marginTop: 24 }}>
                                     Company Tips
                                </div>
                                <div className="tips-list">
                                    {coaching.companyTips?.map((tip, i) => (
                                        <div key={i} className="tip-item">
                                            <span className="tip-dot">→</span>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Checklist */}
                        <div className="coaching-card">
                            <div className="coaching-card-title">
                                ✅ Preparation Checklist
                            </div>
                            <div className="checklist">
                                {coaching.checklist?.map((item, i) => (
                                    <ChecklistItem key={i} text={item} />
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* Empty State — Before Generate */}
                {!coaching && !loading && !displayError && (
                    <div className="empty-coach">
                        <div className="empty-coach-icon"></div>
                        <div className="empty-coach-title">
                            Ready to ace your interview?
                        </div>
                        <div className="empty-coach-sub">
                            Click "Generate Prep Guide" to get AI-powered interview
                            preparation specific to {application?.companyName}!
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}

// Interactive Checklist Item
function ChecklistItem({ text }) {
    const [checked, setChecked] = useState(false);
    return (
        <div
            className={`checklist-item ${checked ? "checklist-item-done" : ""}`}
            onClick={() => setChecked(!checked)}
        >
            <div className={`checkbox ${checked ? "checkbox-checked" : ""}`}>
                {checked && "✓"}
            </div>
            <span>{text}</span>
        </div>
    );
}