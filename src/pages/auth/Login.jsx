import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {loginUser} from "../../api/authApi.js";
import "./Login.css"

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await loginUser(formData);
            console.log("Response:", response);
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", response.username);
            navigate("/dashboard");
            console.log("Form submitted!", formData);
        } catch (err) {
            console.log("Error:", err);
            setError("Invalid email or password. Please try again!");
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
                <p className="auth-subtitle">Your placement journey starts here 🚀</p>

                {error && <div className="auth-error">{error}</div> }

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password..."
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login →"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    )
}