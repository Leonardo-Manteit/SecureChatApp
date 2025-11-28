import { useState } from 'react';
import styles from './SearchBar.module.css';
import DisplayUsers from '../DisplayUsers/DisplayUsers'

export default function SearchBar({ placeholder = "", user }) { // allows a user to search for another user
    const [search, setSearch] = useState('');

    return (
        <>
            <section className={styles.SearchBar} >
                    <input
                        type="text"
                        placeholder={placeholder}
                        onChange={(e) => setSearch(e.target.value.trim())}
                        value={search}
                        />
            <button>Find a Friend</button>
            </section>
            <DisplayUsers search={search} user={user}/>
        </>
    );
}
