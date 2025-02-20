import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Logo from '../Logo/Logo';
import './Header.css';

const Header = ({ onSearch }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const handleScroll = useCallback(() => {
        setIsScrolled(window.pageYOffset > 100);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''} ${location.pathname === '/' && !isScrolled ? 'transparent' : ''}`}>
            <div className="header-content">
                <div className="compact-nav">
                    <div className="logo-container">
                    <Link to="/">
                        <Logo variant="horizontal-dark" className="logo-md" />
                    </Link>
                </div>
                    <button 
                        className="mobile-menu-toggle" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                    </button>

                    <div className={`search-container ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
                        <form className="search-bar" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Search by location or office type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    </div>
                    <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
