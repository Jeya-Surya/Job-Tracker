import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getDashboardStats, getWeeklyStats } from "../../api/analyticsApi";
import MetricCard from "../../components/analytics/MetricCard/MetricCard";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "./Analytics.css";

const STATUS_CONFIG = [
    { key: "applied",     label: "Applied",     color: "#4f9cf9" },
    { key: "shortlisted", label: "Shortlisted",  color: "#a78bfa" },
    { key: "interviews",  label: "Interviews",   color: "#f5a623" },
    { key: "offers",      label: "Offers",       color: "#22d3a5" },
    { key: "rejected",    label: "Rejected",     color: "#f96060" },
];


export default function Analytics() {
    const [stats, setStats]     = useState(null);
    const [weekly, setWeekly]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, weeklyRes] = await Promise.all([
                getDashboardStats(),
                getWeeklyStats(),
            ]);
            setStats(statsRes);
            setWeekly(weeklyRes);
        } catch {
            setError("Failed to load analytics data!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Mount-time data fetch intentionally updates state after API responses.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    // Build funnel data
    const funnelData = stats ? [
        { label: "Applied",     value: stats.totalApplications, color: "#4f9cf9" },
        { label: "Shortlisted", value: stats.shortlisted,       color: "#a78bfa" },
        { label: "Interview",   value: stats.interviews,         color: "#f5a623" },
        { label: "Offer",       value: stats.offers,             color: "#22d3a5" },
    ] : [];

    // Build bar chart data from stats
    const statusBarData = stats ? STATUS_CONFIG.map(s => ({
        name: s.label,
        count: stats[s.key] || 0,
        color: s.color,
    })) : [];

    if (loading) {
        return (
            <Layout>
                <div className="loading-screen">
                    <div className="loader" />
                    <p>Loading analytics...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-msg">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="analytics-page">

                {/* Header */}
                <div className="page-header">
                    <div>
                        <h2 className="page-title">Analytics 📊</h2>
                        <p className="page-subtitle">
                            Track your placement journey progress
                        </p>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="metrics-row">
                    <MetricCard
                        label="Total Applications"
                        value={stats?.totalApplications || 0}
                        sub="All time"
                        color="#4f9cf9"
                    />
                    <MetricCard
                        label="Interview Rate"
                        value={`${stats?.interviewRate || 0}%`}
                        sub="Applications → Interviews"
                        color="#f5a623"
                    />
                    <MetricCard
                        label="Offer Rate"
                        value={`${stats?.offerRate || 0}%`}
                        sub="Applications → Offers"
                        color="#22d3a5"
                    />
                    <MetricCard
                        label="Pending"
                        value={stats?.applied || 0}
                        sub="Awaiting response"
                        color="#a78bfa"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="charts-scroll">
                    <div className="charts-row">

                        {/* Line Chart — Weekly Trend */}
                        <div className="chart-card">
                            <div className="chart-title">Application Trend</div>
                            <div className="chart-subtitle">
                                Weekly applications over time
                            </div>
                            {weekly.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={weekly}>
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
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#22d3a5"
                                            strokeWidth={3}
                                            dot={{ fill: "#22d3a5", r: 5 }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-chart">
                                    No weekly data yet — keep applying! 🚀
                                </div>
                            )}
                        </div>

                        {/* Bar Chart — Status Distribution */}
                        <div className="chart-card">
                            <div className="chart-title">Status Distribution</div>
                            <div className="chart-subtitle">
                                Applications by current status
                            </div>
                            {statusBarData.some(d => d.count > 0) ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={statusBarData} barSize={32}>
                                        <XAxis
                                            dataKey="name"
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
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                            {statusBarData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-chart">
                                    No data yet — start adding applications! 🎯
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* Funnel */}
                <div className="chart-card">
                    <div className="chart-title">Conversion Funnel</div>
                    <div className="chart-subtitle">
                        How your applications progress through each stage
                    </div>
                    <div className="funnel">
                        {funnelData.map((f, i) => {
                            const maxVal = funnelData[0]?.value || 1;
                            const pct = maxVal > 0
                                ? Math.round((f.value / maxVal) * 100)
                                : 0;
                            return (
                                <div key={i} className="funnel-row">
                                    <div className="funnel-label">{f.label}</div>
                                    <div className="funnel-bar-wrap">
                                        <div
                                            className="funnel-bar"
                                            style={{
                                                width: `${pct}%`,
                                                background: f.color,
                                                minWidth: f.value > 0 ? 40 : 0,
                                            }}
                                        />
                                    </div>
                                    <div className="funnel-meta">
                    <span style={{ color: f.color, fontWeight: 700 }}>
                      {f.value}
                    </span>
                                        <span className="funnel-pct">({pct}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="summary-grid">
                    {STATUS_CONFIG.map((s, i) => (
                        <div
                            key={i}
                            className="summary-card"
                            style={{ borderTop: `3px solid ${s.color}` }}
                        >
                            <div
                                className="summary-value"
                                style={{ color: s.color }}
                            >
                                {stats?.[s.key] || 0}
                            </div>
                            <div className="summary-label">{s.label}</div>
                        </div>
                    ))}
                </div>

            </div>
        </Layout>
    );
}