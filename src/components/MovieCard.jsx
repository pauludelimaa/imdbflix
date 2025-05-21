// MovieCard.js
import { Link } from "react-router-dom"; // Certifique-se de que está importado
import { FaStar } from "react-icons/fa";

const imagesURL = import.meta.env.VITE_IMG;

// A prop showLink se torna menos relevante aqui, pois o card inteiro será um link.
// Você pode mantê-la se tiver outros usos para ela, ou removê-la se for apenas para o link "Detalhes".
const MovieCard = ({ movie /*, showLink = true */ }) => {
  return (
    // O Link agora é o elemento raiz que recebe a classe 'movie-card'
    // e engloba todo o conteúdo do card.
    <Link to={`/movie/${movie.id}`} className="movie-card" style={{ textDecoration: 'none' }}>
      <img src={imagesURL + movie.poster_path} alt={movie.title} />
      <h2>{movie.title}</h2>
      <p>
        <FaStar /> {movie.vote_average.toFixed(1)} {/* É bom formatar a nota */}
      </p>
      {/* O link 'Detalhes' interno não é mais necessário, pois o card inteiro é o link.
          Você pode remover a linha abaixo e a prop showLink se ela não tiver outro propósito.
      */}
      {/* {showLink && <Link to={`/movie/${movie.id}`}>Detalhes</Link>} */}
    </Link>
  );
};

export default MovieCard;