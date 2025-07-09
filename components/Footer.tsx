import React from 'react';
import { LocationPinIcon, InstagramIcon, ChatBubbleIcon } from '../constants';

const Footer: React.FC = () => {
    const address = "Av. Ituzaingó 2658, Olavarría, Buenos Aires";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    const instagramUrl = "https://www.instagram.com/ragoautomotores?igsh=MWJuamF6ZXF5YjF4cw%3D%3D";
    const phoneNumber = "5492284635692";
    const phoneDisplay = "+54 9 2284 63-5692";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    const telUrl = `tel:+${phoneNumber}`;


    return (
        <footer className="bg-white dark:bg-rago-black border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 text-center md:text-left">
                    {/* Dirección */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Dirección</h3>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-start text-base text-gray-600 dark:text-gray-400 hover:text-rago-burgundy dark:hover:text-rago-white transition-colors group">
                            <LocationPinIcon className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="group-hover:underline">{address}</span>
                        </a>
                    </div>

                    {/* Síguenos */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Síguenos</h3>
                        <div className="mt-4 flex gap-6 justify-center">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-rago-burgundy dark:hover:text-rago-white transition-transform duration-300 hover:scale-110">
                                <InstagramIcon className="h-8 w-8" />
                            </a>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-500 dark:text-gray-400 hover:text-rago-burgundy dark:hover:text-rago-white transition-transform duration-300 hover:scale-110">
                                <ChatBubbleIcon className="h-8 w-8" />
                            </a>
                        </div>
                    </div>

                    {/* Contacto Directo */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contacto Directo</h3>
                         <a href={telUrl} className="mt-4 inline-flex items-center text-base text-gray-600 dark:text-gray-400 hover:text-rago-burgundy dark:hover:text-rago-white transition-colors group">
                            <ChatBubbleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                            <span className="group-hover:underline">{phoneDisplay}</span>
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-8 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-base text-gray-500 dark:text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0">
                        &copy; {new Date().getFullYear()} Rago Automotores. Todos los derechos reservados.
                    </p>
                     <a href="/" aria-label="Rago Automotores Home" className="order-1 sm:order-2">
                        <img src="https://i.imgur.com/zOGb0ay.jpeg" alt="Rago Automotores Logo" className="h-14" />
                     </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;