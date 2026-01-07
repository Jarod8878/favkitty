import React, { useState, useRef } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

function CatCard({ catUrl, nextImgUrl, currentIndex, totalCats, likedCount, skippedCount, likeCat, skipCat }) {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef(null);

    const minDistance = 250;

    const handleDragStart = (clientX) => {
        setTouchStart(clientX);
        setIsDragging(true);
    }

    const handleDragMove = (clientX) => {
        if (!isDragging && clientX !== touchStart) return;
        setTouchEnd(clientX);
        setSwipeOffset(clientX - touchStart);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minDistance;
        const isRightSwipe = distance < -minDistance;

        if (isLeftSwipe) {
            animateSwipe('left', skipCat);
        } else if (isRightSwipe) {
            animateSwipe('right', likeCat);
        } else {
            setSwipeOffset(0);
        }
    };

    const animateSwipe = (direction, callback) => {
        let finalOffset = 0;
        if (direction === 'left') {
            finalOffset = -1000;
        } else {
            finalOffset = 1000;
        }
        setSwipeOffset(finalOffset);

        setTimeout(() => {
            callback();
            setSwipeOffset(0);
            setTouchStart(0);
            setTouchEnd(0);
        }, 300);
    };

    const handleTouchStart = (e) => handleDragStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => handleDragMove(e.targetTouches[0].clientX);
    const handleTouchEnd = () => handleDragEnd();
    const handleMouseDown = (e) => handleDragStart(e.clientX);
    const handleMouseMove = (e) => handleDragMove(e.clientX);
    const handleMouseLift = () => handleDragEnd();

    const getRotation = () => {
        return swipeOffset / 20;
    };

    const getOpacity = () => {
        return Math.abs(swipeOffset) > minDistance ? 0.7 : 1;
    };

    const getNextCardScale = () => {
        const progress = Math.min(Math.abs(swipeOffset) / 300, 1);
        return 0.95 + (progress * 0.05);
    };

    const getLeftIndicatorClass = () => {
        if (swipeOffset < - minDistance) {
            return 'swipe-indicator left active';
        } else {
            return 'swipe-indicator left';
        }
    };

    const getRightIndicatorClass = () => {
        if (swipeOffset > minDistance) {
            return 'swipe-indicator right active';
        } else {
            return 'swipe-indicator right';
        }
    };

    const progressBar = () => {
        return (currentIndex / totalCats) * 100;
    }

    return (
        <div className="card-wrapper">
            <div className="top-container">
                <h1 className="mb-2">Find your Favorite Kitty</h1>
                <h5 className="mb-3">
                    Seen: {currentIndex} of {totalCats} | Liked: {likedCount} | Skipped: {skippedCount}
                </h5>
            </div>

            <div className="card-stack-container">
                <div className={getLeftIndicatorClass()}>
                    👎
                </div>
                <div className={getRightIndicatorClass()}>
                    ❤️
                </div>

                {nextImgUrl && (
                    <div
                        className="card cat-card preview-card shadow"
                        style={{
                            transform: `scale(${getNextCardScale()})`,
                            transition: isDragging ? 'transform 0.1s' : 'transform 0.3s'
                        }}
                    >
                        <div className="catImg">
                            <img src={nextImgUrl} alt="Next cat" className="cat-image" draggable="false" />
                        </div>
                    </div>
                )}

                <div
                    ref={cardRef}
                    className={`card cat-card mx-auto shadow swipeable-card ${isDragging ? 'dragging' : ''}`}
                    style={{
                        transform: `translateX(${swipeOffset}px) rotate(${getRotation()}deg)`,
                        opacity: getOpacity(),
                        transition: isDragging ? 'none' : 'transform 0.3s, opacity 0.3s'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseLift}
                    onMouseLeave={() => {
                        if (isDragging) {
                            handleMouseLift();
                        }
                    }}
                >
                    <div className="catImg">
                        <img
                            src={catUrl}
                            alt="Cat"
                            className="cat-image"
                            draggable="false"
                        />
                    </div>

                    <div className="card-body d-flex justify-content-around">
                        <button className="btn btn-primary" onClick={skipCat}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down-icon lucide-thumbs-down"><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" /><path d="M17 14V2" /></svg>
                        </button>
                        <button className="btn btn-outline-danger" onClick={likeCat}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
                        </button>
                        
                    </div>
                </div>
            </div>

            <div>
                <ProgressBar
                    now={progressBar()}
                    label={`${progressBar()}%`}
                    variant="success"
                    animated
                    className="mb-3"
                    style={{ marginTop: '10px', height: '20px' }}
                />
                <div className="swipe-hint">
                    Swipe left to skip, right to like
                </div>
            </div>
        </div>
    );
}

export default CatCard;
