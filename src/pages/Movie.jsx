import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BsGraphUp,
  BsWallet2,
  BsHourglassSplit,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";

import MovieCard from "../components/MovieCard";
import "./Movie.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const backdropBaseURL = `https://image.tmdb.org/t/p/w1280`;

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const formatCurrency = (number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      // Limpa estados anteriores ao buscar novos dados
      setMovie(null);
      setTrailerKey(null);

      const movieDetailsUrl = `${moviesURL}${id}?${apiKey}&language=pt-BR`;
      const videosUrl = `${moviesURL}${id}/videos?${apiKey}&language=pt-BR,en-US`;

      try {
        // Fetch detalhes do filme
        const movieRes = await fetch(movieDetailsUrl);
        if (!movieRes.ok) {
          throw new Error(`Erro ao buscar detalhes do filme: ${movieRes.status}`);
        }
        const movieData = await movieRes.json();
        setMovie(movieData);
        console.log("Detalhes do Filme:", movieData);

        // Fetch vídeos do filme
        const videosRes = await fetch(videosUrl);
        if (!videosRes.ok) {
          throw new Error(`Erro ao buscar vídeos: ${videosRes.status}`);
        }
        const videosData = await videosRes.json();
        console.log("Vídeos:", videosData.results);

        if (videosData.results && videosData.results.length > 0) {
          let bestTrailer = videosData.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.iso_639_1 === "pt" &&
              video.iso_3166_1 === "BR" &&
              video.official === true
          );

          if (!bestTrailer) {
            bestTrailer = videosData.results.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.iso_639_1 === "pt" &&
                video.iso_3166_1 === "BR"
            );
          }

          if (!bestTrailer) {
            bestTrailer = videosData.results.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.iso_639_1 === "en" &&
                video.official === true
            );
          }

          if (!bestTrailer) {
            bestTrailer = videosData.results.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.iso_639_1 === "en"
            );
          }
          
          if (!bestTrailer) {
            bestTrailer = videosData.results.find(
              (video) => video.site === "YouTube" && video.type === "Trailer"
            );
          }

          if (!bestTrailer) {
              bestTrailer = videosData.results.find(
                (video) => video.site === "YouTube"
              );
            }

          if (bestTrailer) {
            console.log("Trailer Selecionado:", bestTrailer);
            setTrailerKey(bestTrailer.key);
          } else {
            console.log("Nenhum trailer adequado encontrado.");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do filme ou vídeos:", error);
        // Em caso de erro, garantir que os estados sejam nulos
        setMovie(null);
        setTrailerKey(null);
      }
    };

    if (id) {
      fetchMovieData();
    }

    // Cleanup function para resetar os estados se o componente for desmontado ou o ID mudar
    return () => {
        setMovie(null);
        setTrailerKey(null);
    };

  }, [id]);

  const backdropStyle = movie && movie.backdrop_path
    ? {
        backgroundImage: `url(${backdropBaseURL}${movie.backdrop_path})`,
      }
    : {};

  if (!movie) { // Adiciona um estado de carregamento ou mensagem de "não encontrado"
    return <div className="loading-message">Carregando detalhes do filme...</div>;
  }

  return (
    <div className="movie-detail-container" style={backdropStyle}>
      <div className="movie-page-content">
        {/* Conteúdo do filme é renderizado aqui, pois movie já foi verificado acima */}
        <MovieCard movie={movie} showLink={false} />
        <p className="tagline">{movie.tagline || ""}</p>
        <div className="info">
          <h3>
            <BsWallet2 /> Orçamento:
          </h3>
          <p>{movie.budget > 0 ? formatCurrency(movie.budget) : "Não informado"}</p>
        </div>
        <div className="info">
          <h3>
            <BsGraphUp /> Receita:
          </h3>
          <p>{movie.revenue > 0 ? formatCurrency(movie.revenue) : "Não informado"}</p>
        </div>
        <div className="info">
          <h3>
            <BsHourglassSplit /> Duração:
          </h3>
          <p>{movie.runtime ? `${movie.runtime} minutos` : "Não informado"}</p>
        </div>
        <div className="info description">
          <h3>
            <BsFillFileEarmarkTextFill /> Descrição:
          </h3>
          <p>{movie.overview || "Descrição não disponível."}</p>
        </div>

        {trailerKey && (
          <div className="movie-trailer">
            <h3>Trailer</h3>
            <div className="video-responsive">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                title="Trailer do Filme"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;