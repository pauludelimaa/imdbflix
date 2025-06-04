// Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom"; // Adicionado useSearchParams, useNavigate, Link
import MovieCard from "../components/MovieCard";
import "./MoviesGrid.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Para ler e definir query params
  const navigate = useNavigate(); // Para navegação programática ao mudar categoria

  // Define a categoria inicial baseada na URL ou padrão 'top_rated'
  const initialCategory = searchParams.get("category") || "top_rated";
  const [category, setCategory] = useState(initialCategory);

  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const getMovies = async (url, setMovies) => {
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results);
  };

  // Atualiza a categoria e a URL quando um botão é clicado
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchParams({ category: newCategory }); // Atualiza o query param na URL
    // Ou, se preferir mudar a rota inteira (ex: /category/popular):
    // navigate(`/category/${newCategory}`); // Isso exigiria configuração de rotas diferente
  };

  useEffect(() => {
    // Se o parâmetro da URL mudar, atualize o estado da categoria
    const categoryFromUrl = searchParams.get("category") || "top_rated";
    if (categoryFromUrl !== category) {
      setCategory(categoryFromUrl);
    }

    const topRatedUrl = `${moviesURL}top_rated?${apiKey}&language=pt-BR`;
    const popularUrl = `${moviesURL}popular?${apiKey}&language=pt-BR`;
    const upcomingUrl = `${moviesURL}upcoming?${apiKey}&language=pt-BR`;

    // Limpa os arrays de filmes antes de buscar novos para evitar mostrar dados antigos brevemente
    setTopMovies([]);
    setPopularMovies([]);
    setUpcomingMovies([]);

    if (category === "top_rated") {
      getMovies(topRatedUrl, setTopMovies);
    } else if (category === "popular") {
      getMovies(popularUrl, setPopularMovies);
    } else if (category === "upcoming") {
      getMovies(upcomingUrl, setUpcomingMovies);
    }
  }, [category, searchParams]); // Adicionado searchParams como dependência

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
        {/* Atualiza os botões para usar handleCategoryChange */}
        <button onClick={() => handleCategoryChange("top_rated")} className={category === 'top_rated' ? 'active' : ''}>Melhores Filmes</button>
        <button onClick={() => handleCategoryChange("popular")} className={category === 'popular' ? 'active' : ''}>Populares</button>
        <button onClick={() => handleCategoryChange("upcoming")} className={category === 'upcoming' ? 'active' : ''}>Em Breve</button>
      </div>
      <div className="movies-container">
        {moviesToDisplay.length === 0 && <p>Carregando filmes...</p>}
        {moviesToDisplay.length > 0 &&
          moviesToDisplay.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};

export default Home;