import styles from './DisplayUsers.module.css'
import { useEffect, useState } from "react";
import { getUsers } from "../../utils/user_functions";
import { useNavigate } from 'react-router-dom';

export default function DisplayUsers({search, user}) {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // fetches all users from the database
    useEffect(() => {
        getUsers()
        .then((res) => setAllUsers(res))
        .then(() => setLoading(false))
        .catch(err => console.error('Direct fetch error:', err)); // if fetch fails
    }, []);

    // routes to chatpage when a user clicks chat on another users name
    function handleClick(e) {
        user
        ? navigate(`/Chat/${e.username}`, { state: {targetUser: e} })
        : navigate("/Login");
    };

    // filters the users based on the search query that is parsed into this component from "searchbar"
    const filteredUsers = allUsers.filter(user => 
        user.username.toLowerCase().includes(search.toLowerCase())
    );


    // while the useeffect is happening, displays loading for users on the GUI so they know what is happening
    if (loading) {
            return (
                <>
                    loading users...
                </>
            );
        }
    // displays all current users on the database
    return (
       <div className={styles.users}>
            {filteredUsers.length === 0 ? (
                <div key={1}>No users found.</div>
            ) : (
                filteredUsers.map(user => (
                    <div key={user.username}>
                        <div>{user.username}</div>
                        <button onClick={() => handleClick(user)}>chat</button>
                    </div>
                ))
            )}
        </div>
    )
}