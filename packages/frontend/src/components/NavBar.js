import React from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Heart, Share2 } from 'lucide-react';
import { colors } from '../styles/theme';

const NavBar = ({ userGender }) => {
    return (
        <nav style={styles.nav}>
            <ul style={styles.navLinks}>
                <li>
                    <Link to="/profile" style={styles.link}>
                        <User style={styles.icon} />
                    </Link>
                </li>
                <li>
                    <Link to="/browse" style={styles.link}>
                        <Search style={styles.icon} />
                    </Link>
                </li>
                <li>
                    <Link to="/matches" style={styles.link}>
                        <Heart style={styles.icon} />
                    </Link>
                </li>
                {userGender !== 'male' && (
                    <li>
                        <Link to="/referrals" style={styles.link}>
                            <Share2 style={styles.icon} />
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        width: '100%',
        maxWidth: '390px',
        height: '60px',
        position: 'fixed',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderTop: `1px solid ${colors.gray.border}`,
        zIndex: '10',
    },
    navLinks: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        padding: '0',
        margin: '0',
        listStyle: 'none',
        alignItems: 'center',
    },
    link: {
        color: colors.gray.text,
        textDecoration: 'none',
        fontSize: '1.5rem',
        padding: '10px',
    },
    icon: {
        width: '24px',
        height: '24px',
        color: colors.gray.text,
        '&:hover': {
            color: colors.green.light
        }
    }
};

export default NavBar;