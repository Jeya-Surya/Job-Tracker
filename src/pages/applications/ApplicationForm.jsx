import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
    createApplication,
    updateApplication,
    getApplicationById,
} from "../../api/applicationApi";
import "./ApplicationForm.css";

const STATUSES = ["APPLIED", "SHORTLISTED", "INTERVIEW", "OFFER", "REJECTED"];

const EMPTY_FORM = {
    companyName: "",
    role: "",
    location: "",
    jobUrl: "",
    status: "APPLIED",
    dateApplied: new Date().toISOString().split("T")[0], // Today's date
    notes: "",
};

export default function ApplicationForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // If id exists → Edit mode, else → Add mode

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading]   = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError]       = useState("");

    // If edit mode → fetch existing application data
    useEffect(() => {
        if (isEditMode) {
            fetchApplication();
        }
    }, [id]);

    const fetchApplication = async () => {
        try {
            setFetching(true);
            const data = await getApplicationById(id);
            setFormData({
                companyName: data.companyName || "",
                role:        data.role || "",
                location:    data.location || "",
                jobUrl:      data.jobUrl || "",
                status:      data.status || "APPLIED",
                dateApplied: data.dateApplied || "",
                notes:       data.notes || "",
            });
        } catch (err) {
            setError("Failed to load application!");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isEditMode) {
                await updateApplication(id, formData);
            } else {
                await createApplication(formData);
            }
            navigate("/applications");
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again!");
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
            <div className="form-page">

                {/* Header */}
                <div className="form-header">
                    <div>
                        <h2 className="page-title">
                            {isEditMode ? "✏️ Edit Application" : "➕ Add Application"}
                        </h2>
                        <p className="page-subtitle">
                            {isEditMode
                                ? "Update the details of your application"
                                : "Track a new job application"}
                        </p>
                    </div>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/applications")}
                    >
                        ← Back
                    </button>
                </div>

                {/* Error */}
                {error && <div className="form-error">{error}</div>}

                {/* Form */}
                <div className="form-card">
                    <form onSubmit={handleSubmit} className="app-form">

                        {/* Row 1 — Company + Role */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="e.g. Zoho Corporation"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role / Position <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="role"
                                    placeholder="e.g. Software Engineer"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 — Location + Status */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Chennai"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Status <span className="required">*</span></label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3 — Job URL + Date */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Job URL</label>
                                <input
                                    type="url"
                                    name="jobUrl"
                                    placeholder="https://company.com/careers"
                                    value={formData.jobUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date Applied <span className="required">*</span></label>
                                <input
                                    type="date"
                                    name="dateApplied"
                                    value={formData.dateApplied}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-group full-width">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                placeholder="Write anything useful — interview experience, contacts, salary range..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/applications")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? isEditMode ? "Updating..." : "Adding..."
                                    : isEditMode ? "Update Application" : "Add Application"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </Layout>
    );
}