import "./StatusBadge.css";

export default function StatusBadge({ status, colorMap, defaultColor = "#64748b" }) {
    const cfg = colorMap?.[status];
    const color = cfg?.color || defaultColor;
    const background = cfg?.bg || `${color}20`;

    return (
        <span
            className="jt-status-badge"
            style={{
                background,
                color,
                border: `1px solid ${color}40`,
            }}
        >
            <span className="jt-status-badge-dot" style={{ background: color }} />
            {status}
        </span>
    );
}

