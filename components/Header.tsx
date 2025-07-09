
import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleIcon } from '../constants';

interface HeaderProps {
    // Props no longer needed as admin state is handled by URL
}

const Header: React.FC<HeaderProps> = () => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const controlHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const threshold = 100; // Only hide after scrolling 100px

            // Hide if scrolling down past the threshold
            if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
                setIsVisible(false);
            } 
            // Show if scrolling up
            else if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }
            
            // Update the last scroll position
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlHeaderVisibility, { passive: true });

        return () => {
            window.removeEventListener('scroll', controlHeaderVisibility);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    const headerClasses = `
        bg-rago-white dark:bg-rago-black 
        shadow-md sticky top-0 z-40 
        transition-transform duration-500 ease-in-out
        border-b-4 border-rago-burgundy dark:border-b dark:border-gray-800
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    `;

    const contactMessage = "Hola, estoy interesado en sus vehículos.";
    const whatsappLink = `https://wa.me/5492284635692?text=${encodeURIComponent(contactMessage)}`;

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                <a href="/" className="flex items-center" aria-label="Rago Automotores Home">
                    <img src="https://i.imgur.com/zOGb0ay.jpeg" alt="Rago Automotores Logo" className="h-16" />
                </a>
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium text-white bg-rago-burgundy rounded-lg hover:bg-rago-burgundy-darker focus:outline-none focus:ring-4 focus:ring-rago-burgundy/50 transition-all duration-300"
                >
                    <ChatBubbleIcon className="h-5 w-5 md:h-6 md:w-6" />
                    <span>Contactar</span>
                </a>
            </div>
        </header>
    );
};

export default Header;