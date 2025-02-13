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
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();

    const handleScroll = useCallback(() => {
        setIsScrolled(window.pageYOffset > 100);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const observerOptions = {
            rootMargin: '-80px 0px 0px 0px',
            threshold: 0.5
        };

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        // Observe sections with IDs
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
        setIsMobileMenuOpen(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
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
                        <Link 
                            to="/" 
                            className={location.pathname === '/' ? 'active' : ''}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/offices" 
                            className={location.pathname === '/offices' ? 'active' : ''}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Offices
                        </Link>
                        <a 
                            href="#about" 
                            onClick={() => scrollToSection('about')}
                            className={activeSection === 'about' ? 'active' : ''}
                        >
                            About
                        </a>
                        <a 
                            href="#contact" 
                            onClick={() => scrollToSection('contact')}
                            className={activeSection === 'contact' ? 'active' : ''}
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
