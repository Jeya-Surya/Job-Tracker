import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {registerUser} from "../../api/authApi.js";
import "./Login.css";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
            navigate("/login");
        } catch (err) {
            setError(err.message || "Could not create your account. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">

                <div className="auth-logo">
                    <span className="logo-job">Job</span>
                    <span className="logo-track">Track</span>
                </div>
                <p className="auth-subtitle">Create your free account today 🎯</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your name..."
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Creating account..." : "Register →"}
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>

            </div>
        </div>
    );
}