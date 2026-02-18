import React, { useState, useEffect } from 'react';
import { FaUsers, FaGlobeAmericas, FaFilm, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import '../css/StoryNavigation.scss';

const StoryNavigation = ({ hasCharacters, hasEnvironments, hasScenes }) => {
    const [activeSection, setActiveSection] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['characters', 'environments', 'scenes'];
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const navItems = [
        {
            id: 'characters',
            label: 'الشخصيات',
            icon: <FaUsers />,
            visible: hasCharacters
        },
        {
            id: 'scenes',
            label: 'المشاهد',
            icon: <FaFilm />,
            visible: hasScenes
        },
        {
            id: 'environments',
            label: 'البيئات',
            icon: <FaGlobeAmericas />,
            visible: hasEnvironments
        }
    ];

    const visibleItems = navItems.filter(item => item.visible);

    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <div className="story-navigation">
            <button
                className="story-nav-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'إخفاء التنقل' : 'إظهار التنقل'}
            >
                {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </button>

            <nav className={`story-nav-content ${isOpen ? 'open' : ''}`}>
                <h3 className="story-nav-title">التنقل السريع</h3>
                <ul className="story-nav-list">
                    {visibleItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`story-nav-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => scrollToSection(item.id)}
                            >
                                <span className="story-nav-icon">{item.icon}</span>
                                <span className="story-nav-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default StoryNavigation;

