
import { Link } from "react-router-dom";

function PlaceCard({ place }) {

  return (
    <div className="card shadow-sm h-100">

      {/* Image */}
      <img
        src={place.image_url || "/default-place.jpg"}
        className="card-img-top"
        alt={place.name}
        style={{
          height: "220px",
          objectFit: "cover"
        }}
      />

      {/* Content */}
      <div className="card-body">

        <h5 className="card-title">
          {place.name}
        </h5>

        <p className="text-muted">
          📍 {place.location}
        </p>

        <p>
          {place.description?.slice(0, 100)}
          {place.description?.length > 100 && "..."}
        </p>

        <span className="badge bg-primary">
          {place.category}
        </span>

        <div className="mt-3">
          <Link
            to={`/places/${place.id}`}
            className="btn btn-outline-primary"
          >
            View Details
          </Link>
        </div>

      </div>

    </div>
  );
}

export default PlaceCard;

