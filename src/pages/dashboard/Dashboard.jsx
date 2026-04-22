import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getDashboardStats, getWeeklyStats } from "../../api/analyticsApi";
import { getAllApplications } from "../../api/applicationApi";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/dashboard/StatCard/StatCard";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import "./Dashboard.css";

const STATUS_COLORS = {
    APPLIED: { color: "#4f9cf9" },
    SHORTLISTED: { color: "#a78bfa" },
    INTERVIEW: { color: "#f5a623" },
    OFFER: { color: "#22d3a5" },
    REJECTED: { color: "#f96060" },
};

const PIE_COLORS = ["#4f9cf9", "#a78bfa", "#f5a623", "#22d3a5", "#f96060"];

function getTimeGreeting(date = new Date()) {
    const hour = date.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [weekly, setWeekly] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = localStorage.getItem("username") || "User";
    const greeting = getTimeGreeting();

    async function fetchAllData() {
        try {
            const [statsRes, weeklyRes, appsRes] = await Promise.all([
                getDashboardStats(),
                getWeeklyStats(),
                getAllApplications(),
            ]);
            setStats(statsRes);
            setWeekly(weeklyRes);
            setRecent(appsRes.slice(0, 5));
        } catch {
            setError("Failed to load dashboard data!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Mount-time data fetch intentionally updates state after API responses.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllData();
    }, []);

    const pieData = stats
        ? [
              { name: "Applied", value: stats.applied },
              { name: "Shortlisted", value: stats.shortlisted },
              { name: "Interview", value: stats.interviews },
              { name: "Offer", value: stats.offers },
              { name: "Rejected", value: stats.rejected },
          ].filter((d) => d.value > 0)
        : [];

    if (loading) {
        return (
            <Layout>
                <div className="loading-screen">
                    <div className="loader" />
                    <p>Loading your dashboard...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-screen">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h2 className="dashboard-title">
                            {greeting}, {username}! 👋
                        </h2>
                        <p className="dashboard-subtitle">
                            Here&apos;s your placement journey at a glance
                        </p>
                    </div>
                    <div className="dashboard-date">
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                <div className="stat-cards">
                    <StatCard
                        label="Total Applied"
                        value={stats?.totalApplications || 0}
                        sub="All time applications"
                        color="#4f9cf9"
                        icon="📨"
                    />
                    <StatCard
                        label="Interviews"
                        value={stats?.interviews || 0}
                        sub={`${stats?.interviewRate || 0}% interview rate`}
                        color="#f5a623"
                        icon="🎤"
                    />
                    <StatCard
                        label="Offers"
                        value={stats?.offers || 0}
                        sub={`${stats?.offerRate || 0}% offer rate`}
                        color="#22d3a5"
                        icon="🏆"
                    />
                    <StatCard
                        label="Rejected"
                        value={stats?.rejected || 0}
                        sub="Keep going! 💪"
                        color="#f96060"
                        icon="❌"
                    />
                </div>

                <div className="charts-row">
                    <div className="chart-card">
                        <div className="chart-title">Applications Per Week</div>
                        {weekly.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={weekly} barSize={28}>
                                    <XAxis
                                        dataKey="week"
                                        tick={{ fill: "#64748b", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#64748b", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#1c2030",
                                            border: "1px solid #1e2333",
                                            borderRadius: 8,
                                            color: "#e2e8f0",
                                        }}
                                        cursor={{ fill: "#ffffff08" }}
                                    />
                                    <Bar dataKey="count" fill="#4f9cf9" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">No data yet — start adding applications! 🚀</div>
                        )}
                    </div>

                    <div className="chart-card">
                        <div className="chart-title">Status Breakdown</div>
                        {pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1c2030",
                                                border: "1px solid #1e2333",
                                                borderRadius: 8,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pie-legend">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="legend-item">
                                            <span className="legend-dot" style={{ background: PIE_COLORS[i] }} />
                                            {d.name} ({d.value})
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-chart">No data yet — start adding applications! 🚀</div>
                        )}
                    </div>
                </div>

                <div className="recent-card">
                    <div className="recent-header">
                        <div className="chart-title">Recent Applications</div>
                    </div>

                    {recent.length > 0 ? (
                        <div className="recent-list">
                            {recent.map((app, i) => (
                                <div
                                    key={app.id}
                                    className="recent-item"
                                    style={{
                                        borderBottom:
                                            i < recent.length - 1 ? "1px solid #1e2333" : "none",
                                    }}
                                >
                                    <div className="recent-left">
                                        <div className="company-avatar">{app.companyName.charAt(0)}</div>
                                        <div>
                                            <div className="company-name">{app.companyName}</div>
                                            <div className="company-role">
                                                {app.role} · {app.location || "Remote"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-right">
                                        <span className="recent-date">{app.dateApplied}</span>
                                        <StatusBadge status={app.status} colorMap={STATUS_COLORS} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-chart">No applications yet — add your first one! 🎯</div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

