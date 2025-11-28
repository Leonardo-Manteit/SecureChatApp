import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserFromLocalStorage } from '../../utils/auth_service.js';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import styles from './Nav.module.css'

export default function Nav() {
    const navigate = useNavigate()
    const currentLocation = useLocation();
    const [user, setUser] = useState(getUserFromLocalStorage());

    function handleLogout() {
        setUser(null);
        localStorage.removeItem('token');
        currentLocation.pathname === '/' ? location.reload() : navigate('/') // important if logout happens while in a chat room
    }

    return (
        <div className={styles.navWrapper}>      
            <header>
                <div className={styles.logo}>
                    <h1>
                        <Link to="/">
                            <span style= {{ fontSize: '125%'}}>S</span>ecure
                            <span style= {{ fontSize: '125%'}}>C</span>hat
                            <span style= {{ fontSize: '125%'}}>App</span>
                        </Link>
                    </h1>
                </div>
                <nav className={styles.navbar}>
                    <ul>
                        {user ? 
                        <button onClick={handleLogout}>Logout of {user.username}</button>
                        : <button><Link to="/Login">Login</Link></button> }
                    </ul>
                </nav>
            </header> 
        </div>
    );
}
