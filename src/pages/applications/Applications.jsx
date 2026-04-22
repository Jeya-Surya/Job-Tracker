import { useState, useEffect, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import {
    getAllApplications,
    deleteApplication,
} from "../../api/applicationApi";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import "./Applications.css";

const STATUS_COLORS = {
    APPLIED:     { color: "#4f9cf9", bg: "#4f9cf920" },
    SHORTLISTED: { color: "#a78bfa", bg: "#a78bfa20" },
    INTERVIEW:   { color: "#f5a623", bg: "#f5a62320" },
    OFFER:       { color: "#22d3a5", bg: "#22d3a520" },
    REJECTED:    { color: "#f96060", bg: "#f9606020" },
};

const STATUSES = ["All", "APPLIED", "SHORTLISTED", "INTERVIEW", "OFFER", "REJECTED"];

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [search, setSearch]             = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState("");
    const [deleteId, setDeleteId]         = useState(null);

    async function fetchApplications() {
        try {
            setLoading(true);
            const data = await getAllApplications();
            setApplications(data);
        } catch {
            setError("Failed to load applications!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchApplications();
    }, []);

    const filtered = useMemo(() => {
        let result = applications;

        if (activeFilter !== "All") {
            result = result.filter((app) => app.status === activeFilter);
        }

        if (search.trim()) {
            const searchText = search.toLowerCase();
            result = result.filter((app) =>
                app.companyName.toLowerCase().includes(searchText) ||
                app.role.toLowerCase().includes(searchText)
            );
        }

        return result;
    }, [applications, search, activeFilter]);

    const handleDelete = async (id) => {
        try {
            await deleteApplication(id);
            // Remove from state without refetching
            setApplications(prev => prev.filter(app => app.id !== id));
            setDeleteId(null);
        } catch {
            alert("Failed to delete application!");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-screen">
                    <div className="loader" />
                    <p>Loading applications...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="applications-page">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h2 className="page-title">Applications</h2>
                        <p className="page-subtitle">
                            {applications.length} total · {filtered.length} showing
                        </p>
                    </div>
                    <button
                        className="add-btn"
                        onClick={() => window.location.href = "/applications/add"}
                    >
                        ＋ Add Application
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="controls-row">
                    <input
                        className="search-input"
                        placeholder="🔍  Search company or role..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="filter-tabs">
                        {STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveFilter(s)}
                                className={`filter-tab ${activeFilter === s ? "filter-tab-active" : ""}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && <div className="error-msg">{error}</div>}

                {/* Table */}
                {filtered.length > 0 ? (
                    <div className="table-card">
                        <div className="table-scroll">
                            <table className="app-table">
                                <thead>
                                <tr>
                                    {["Company", "Role", "Location", "Date Applied", "Status", "Actions"].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="company-cell">
                                                <div className="company-avatar">
                                                    {app.companyName.charAt(0)}
                                                </div>
                                                <span className="company-name">{app.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="muted">{app.role}</td>
                                        <td className="muted">{app.location || "—"}</td>
                                        <td className="muted">{app.dateApplied || "—"}</td>
                                        <td><StatusBadge status={app.status} colorMap={STATUS_COLORS} /></td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="coach-btn"
                                                    onClick={() => window.location.href = `/applications/coach/${app.id}`}
                                                >
                                                    🤖 AI Coach
                                                </button>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => window.location.href = `/applications/edit/${app.id}`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => setDeleteId(app.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <div className="empty-title">No applications found</div>
                        <div className="empty-sub">
                            {search || activeFilter !== "All"
                                ? "Try adjusting your search or filter"
                                : "Click '+ Add Application' to get started!"}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteId && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-icon">🗑️</div>
                            <h3 className="modal-title">Delete Application?</h3>
                            <p className="modal-sub">
                                This action cannot be undone!
                            </p>
                            <div className="modal-actions">
                                <button
                                    className="modal-cancel"
                                    onClick={() => setDeleteId(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="modal-confirm"
                                    onClick={() => handleDelete(deleteId)}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}