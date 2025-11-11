import React,{useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Link, useNavigate} from 'react-router-dom';
import logo from "../../assets/tukerinLogo.jpg";
import './Navbar.css';
import Button from "../common/Button.jsx";
import SearchBar from "../common/SearchBar.jsx";
import Modal from "../common/Modal.jsx";

const Navbar = () => {
    const {isAuthenticated, user, logout, points} = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);  // Tutup dropdown
        setIsLogoutModalOpen(true); // Buka modal
    };

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutModalOpen(false);
        // Arahkan ke homepage setelah logout
        navigate('/');
    };

    return (
        <nav className="navbar ">
            <div className="logo">
                <Link to="/">
                <img src={logo} alt="logo" className="logo-image" />
                </Link>
            </div>
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="navbar-buttons">
                {isAuthenticated ? (
                    <>
                        {user?.role === 'Admin' && (
                            <Link to="/admin" className="admin-link">
                                Admin Dashboard
                            </Link>
                        )}

                        <Link to="/post-item">Post New Item</Link>
                        <Link to="/dashboard">My Dashboard</Link>

                        {/* Wrapper baru untuk dropdown */}
                        <div className="profile-menu-container">
                            {/* Tombol ini akan membuka/menutup dropdown */}
                            <button
                                className="profile-menu-button"
                                onClick={() => setIsDropdownOpen(prev => !prev)}
                            >
                                {user?.username || 'User'}
                                <span className="navbar-points">({points} Pts)</span> ▼
                            </button>

                            {/* Dropdown-nya (hanya muncul jika isDropdownOpen true) */}
                            {isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)} // Tutup setelah diklik
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/points"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        My Points
                                    </Link>
                                    <button
                                        className="dropdown-item logout"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>                    </>
                ) : (
                    <>
                        {/*<Link to="/login">Login</Link>*/}
                        <span className="button-group">
                        <Button onClick={()=> navigate('/login')}>
                            Masuk
                        </Button>
                        <Button variant={"secondary"} onClick={()=> navigate('/register')}>
                            Daftar
                        </Button>
                        {/*<Link to="/register">Register</Link>*/}
                        </span>
                    </>
                )}
            </div>
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
                <div className="logout-modal-content">
                    <h2 style={{ marginTop: 0 }}>Konfirmasi Logout</h2>
                    <p>Apakah kamu yakin ingin keluar dari akun ini?</p>
                    <div className="logout-modal-actions">
                        <Button
                            variant="secondary"
                            onClick={() => setIsLogoutModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleLogoutConfirm}
                        >
                            Ya, Logout
                        </Button>
                    </div>
                </div>
            </Modal>
        </nav>
    )
};
export default Navbar;



// export default function Navbar() {
//     return (
//         <header>
//             <h1>
//                 Hello, World!
//             </h1>
//         </header>
//     )
// }