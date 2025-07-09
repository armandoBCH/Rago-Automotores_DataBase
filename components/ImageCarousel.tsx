import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../constants';
import { optimizeUrl } from '../utils/image';

interface ImageCarouselProps {
    images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const currentImage = images?.[currentIndex] || '';

    useEffect(() => {
        // Reset loaded state when image changes
        setIsLoaded(false);
    }, [currentIndex]);
    
    if (!images || images.length === 0) {
        return <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
    }

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    }

    const placeholderUrl = optimizeUrl(currentImage, { w: 40, h: 30, fit: 'cover', blur: 2, output: 'webp' });
    const srcSet = [600, 800, 1200, 1600]
        .map(w => `${optimizeUrl(currentImage, { w, h: Math.round(w * 0.75), fit: 'cover', output: 'webp', q: 80 })} ${w}w`)
        .join(', ');

    return (
        <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${placeholderUrl})` }}>
            <img
                key={currentImage} // Use key to force re-render on image change
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                src={optimizeUrl(currentImage, { w: 1200, h: 900, fit: 'cover', output: 'webp', q: 80 })}
                srcSet={srcSet}
                sizes="(max-width: 1279px) 60vw, 100vw"
                alt={`Vehicle image ${currentIndex + 1}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
            />
            {images.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white transition-opacity z-10">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={goToNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white transition-opacity z-10">
                        <ArrowRightIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {images.map((_, index) => (
                             <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${currentIndex === index ? 'bg-white scale-125' : 'bg-gray-400/70'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
