import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate não está sendo usado neste componente. Se não for usar, pode remover.
import { useParams } from "react-router-dom";
import {
  BsGraphUp,
  BsWallet2,
  BsHourglassSplit,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";

import MovieCard from "../components/MovieCard";

import "./Movie.css"; // Certifique-se de que este arquivo terá os novos estilos CSS para o backdrop e overlay.

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
// ADICIONE ESTA CONSTANTE para a URL base das imagens de fundo (backdrops)
const backdropBaseURL = `https://image.tmdb.org/t/p/w1280`; // Você pode escolher outros tamanhos como 'w780' ou 'original'

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data); // Bom para debugging
    setMovie(data);
  };

  const formatCurrency = (number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  useEffect(() => {
    // MODIFIQUE A URL para incluir o idioma e, se desejar, outros parâmetros
    const movieUrl = `${moviesURL}${id}?${apiKey}&language=pt-BR`; // Adicionado language=pt-BR
    getMovie(movieUrl);
  }, [id]); // ADICIONE 'id' AO ARRAY DE DEPENDÊNCIAS do useEffect

  // ADICIONE ESTA LÓGICA para criar o estilo inline do backdrop
  const backdropStyle = movie && movie.backdrop_path
    ? {
        backgroundImage: `url(${backdropBaseURL}${movie.backdrop_path})`,
      }
    : {}; // Se não houver backdrop_path, o estilo será um objeto vazio

  return (
    // SUBSTITUA a div principal para aplicar o estilo do backdrop
    // <div className="movie-page">
    <div className="movie-detail-container" style={backdropStyle}>
      {/* ADICIONE um elemento para o overlay (que será estilizado no CSS) */}
      <div className="backdrop-overlay"></div>

      {/* ADICIONE um container para o conteúdo da página, que ficará sobre o overlay */}
      <div className="movie-page-content">
        {movie && (
          <>
            <MovieCard movie={movie} showLink={false} />
            {/* Adicione uma verificação para tagline, caso não exista */}
            <p className="tagline">{movie.tagline || ""}</p>
            <div className="info">
              <h3>
                <BsWallet2 /> Orçamento:
              </h3>
              {/* Adicione verificações para exibir "Não informado" se os dados não existirem ou forem 0 */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Movie;