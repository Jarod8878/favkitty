import React, { useEffect, useState } from "react";
import CatCard from "./catCard";
import Summary from "./Summary";

const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = reject;
  });
};

function App() {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likedCats, setLikedCats] = useState([]);
  const [skippedCats, setSkippedCats] = useState([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const loadCats = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://cataas.com/api/cats");
        const data = await res.json();
        const urls = data.map(
          (cat) => "https://cataas.com/cat/" + cat.id
        );

        const shuffleImages = urls.sort(() => Math.random() - 0.5);

        await preloadImage(shuffleImages[0]);
        await preloadImage(shuffleImages[1]);

        setCats(shuffleImages);
      } catch (err) {
        console.error("Error loading cats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCats();
  }, []);

  const likeCats = () => {
    setLikedCats([...likedCats, cats[currentIndex]]);
    nextCat();
  };

  const skipCats = () => {
    setSkippedCats([...skippedCats, cats[currentIndex]]);
    nextCat();
  };

  const nextCat = async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= cats.length) {
      setComplete(true);
      return;
    }

    setLoading(true);

    try {
      await preloadImage(cats[nextIndex]);
      setCurrentIndex(nextIndex);
    } finally {
      setLoading(false);
    }
  };

  const restart = async () => {
    setLoading(true);

    try {
      setLikedCats([]);
      setSkippedCats([]);
      setCurrentIndex(0);
      setComplete(false);

      const res = await fetch("https://cataas.com/api/cats");
      const data = await res.json();

      const urls = data.map(
        (cat) => "https://cataas.com/cat/" + cat.id
      );

      const shuffleImages = urls.sort(() => Math.random() - 0.5);

      await preloadImage(shuffleImages[0]);
      await preloadImage(shuffleImages[1]);

      setCats(shuffleImages);
    } catch (err) {
      console.error("Error restarting cats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center">
      {loading ? (
        <p style={{fontSize:'24px'}}>Loading images</p>
      ) : complete ? (
        <Summary
          total={cats.length}
          likedCats={likedCats}
          skippedCats={skippedCats}
          restart={restart}
        />
      ) : (
        <CatCard
          catUrl={cats[currentIndex]}
          nextImgUrl={cats[currentIndex + 1]}
          currentIndex={currentIndex}
          totalCats={cats.length}
          likedCount={likedCats.length}
          skippedCount={skippedCats.length}
          likeCat={likeCats}
          skipCat={skipCats}
        />
      )}
    </div>
  );
}

export default App;