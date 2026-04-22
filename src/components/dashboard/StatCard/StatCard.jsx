import "./StatCard.css";

export default function StatCard({ label, value, sub, color, icon }) {
    return (
        <div className="dashboard-stat-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="dashboard-stat-icon" style={{ background: `${color}18` }}>
                {icon}
            </div>
            <div className="dashboard-stat-info">
                <div className="dashboard-stat-value">{value}</div>
                <div className="dashboard-stat-label">{label}</div>
                <div className="dashboard-stat-sub" style={{ color }}>{sub}</div>
            </div>
        </div>
    );
}

