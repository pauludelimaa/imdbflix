import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

import "./MoviesGrid.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [category, setCategory] = useState("top_rated"); 

  const getMovies = async (url, setMovies) => {
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results);
  };

  useEffect(() => {
    const topRatedUrl = `${moviesURL}top_rated?${apiKey}&language=pt-BR`;
    const popularUrl = `${moviesURL}popular?${apiKey}&language=pt-BR`;
    const upcomingUrl = `${moviesURL}upcoming?${apiKey}&language=pt-BR`;

    if (category === "top_rated") {
      getMovies(topRatedUrl, setTopMovies);
    } else if (category === "popular") {
      getMovies(popularUrl, setPopularMovies);
    } else if (category === "upcoming") {
      getMovies(upcomingUrl, setUpcomingMovies);
    }
  }, [category]);

  const moviesToDisplay = 
    category === "top_rated" ? topMovies :
    category === "popular" ? popularMovies :
    category === "upcoming" ? upcomingMovies :
    [];

  return (
    <div className="container">
      <h2 className="title">
  {category === "top_rated" 
    ? "Melhores Filmes" 
    : ` ${category === "popular" ? "Populares" : "Lançando Em Breve"}`
  }
</h2>
      <div className="button-container">
        <button onClick={() => setCategory("top_rated")}>Melhores Filmes</button>
        <button onClick={() => setCategory("popular")}>Populares</button>
        <button onClick={() => setCategory("upcoming")}>Em Breve</button>
      </div>
      <div className="movies-container">
        {moviesToDisplay.length > 0 &&
          moviesToDisplay.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};

export default Home;
