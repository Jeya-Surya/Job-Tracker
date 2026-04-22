import "./MetricCard.css";

export default function MetricCard({ label, value, sub, color }) {
    return (
        <div className="analytics-metric-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="analytics-metric-value" style={{ color }}>{value}</div>
            <div className="analytics-metric-label">{label}</div>
            <div className="analytics-metric-sub">{sub}</div>
        </div>
    );
}

