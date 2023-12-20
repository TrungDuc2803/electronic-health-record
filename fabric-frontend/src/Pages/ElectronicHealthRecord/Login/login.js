import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
// import '../../CSS/Login/login.css';

import yourImage from 'A:/EHR-Blockchain-Hyperledger/fabric-frontend/src/Pages/Images/doctorWallpaper.jpg'


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleLogin = async () => {
        try {
            // Send a GET request to authenticate the user
            const response = await fetch(`http://localhost:3001/api/login?username=${username}&password=${password}&userType=${userType}`);

            if (response.ok) {
                // Authentication successful
                const data = await response.json();
                console.log('User authenticated:', data);
                setError('');

            // Update user context
            updateUser(data);

            // Redirect based on user type
            if (data.UserType === 'patient') {
                // Assuming you have a route defined for PatientPage in App.js
                navigate('/patient-homepage');
            } else if (data.UserType === 'doctor') {
                // Redirect to other pages based on user type as needed
                navigate('/doctor-homepage');
            } else if (data.UserType === 'hospital') {
                // Redirect to other pages based on user type as needed
                navigate('/hospital-homepage');
            } 
            } else {
                // Authentication failed
                setError('Authentication failed');
            }
        } catch (error) {
            console.error(`Failed to authenticate user: ${error}`);
            setError('Authentication failed');
        }
    };

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${yourImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ height: '45vh',width:'80vh'}}>
                <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px', textAlign: 'center' }}>
                    <h1>Đăng nhập</h1>
                    <div>
                        <label htmlFor="username">Tên người dùng:</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '10px',marginTop:'10px' }}> {/* Thêm khoảng cách 5px giữa userType và nút Đăng nhập */}
                        <label htmlFor="userType">Loại người dùng:</label>
                        <select id="userType" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                            <option value="">Chọn loại người dùng</option>
                            <option value="patient">Bệnh nhân</option>
                            <option value="doctor">Bác sĩ</option>
                            <option value="hospital">Bệnh viện</option>
                        </select>
                    </div>
                    <button onClick={handleLogin}>Đăng nhập</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login;




