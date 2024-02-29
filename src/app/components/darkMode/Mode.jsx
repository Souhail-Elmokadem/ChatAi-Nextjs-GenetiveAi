import { useEffect, useState } from 'react';
import styles from './Mode.module.css';

function Mode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
        // Retrieve darkMode preference from localStorage
        const storedDarkMode = localStorage.getItem('darkMode');
        // Convert to boolean, default to true if not set
        
        return storedDarkMode ? JSON.parse(storedDarkMode) : true;
    }
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
        // Apply dark mode class to body based on the state
        document.body.classList.toggle('dark-mode', isDarkMode);
        // Update localStorage with the current darkMode preference
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        }
    }, [isDarkMode]); // Re-run effect whenever isDarkMode state changes

    function toggleDarkMode() {
        // Toggle dark mode state
        setIsDarkMode(prevDarkMode => !prevDarkMode);
    }

    return (
        <button className={styles.mode} onClick={toggleDarkMode}>
            <div className="darkMode">
                <div className="icon">L</div>
                <div className="icon">N</div>
            </div>
        </button>
    );
}

export default Mode;
