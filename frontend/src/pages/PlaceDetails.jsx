import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";


const BACKEND_URL = "http://127.0.0.1:8000";


function PlaceDetails() {

  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {


    API.get(`/places/${id}`)

      .then((response) => {

        console.log(
          "Place Details:",
          response.data
        );


        setPlace(response.data);

        setLoading(false);


      })


      .catch((error) => {


        console.log(
          "Place Details Error:",
          error
        );


        setLoading(false);


      });



  }, [id]);





  if (loading) {

    return (

      <h3 className="text-center mt-5">
        Loading place details...
      </h3>

    );

  }





  if (!place) {

    return (

      <div className="container mt-5 text-center">

        <h3>
          Place not found
        </h3>


        <Link
          to="/places"
          className="btn btn-primary"
        >

          Back To Places

        </Link>


      </div>

    );

  }






  const image = place.image_url

    ? (
        place.image_url.startsWith("http")
        ? place.image_url
        : `${BACKEND_URL}${place.image_url}`
      )

    : "https://via.placeholder.com/800x450?text=No+Image";





  return (

    <div className="container mt-5">


      <Link
        to="/places"
        className="btn btn-secondary mb-4"
      >

        ← Back

      </Link>





      <div className="card shadow">


        <img

          src={image}

          className="card-img-top"

          alt={place.name}

          style={{
            height:"450px",
            objectFit:"cover"
          }}

          onError={(e)=>{

            e.target.src =
            "https://via.placeholder.com/800x450?text=Image+Not+Found";

          }}

        />




        <div className="card-body">


          <h1>

            {place.name}

          </h1>




          <h5>

            📍 {place.location}

          </h5>




          <p>

            🏛️ Category:
            {" "}
            {place.category}

          </p>




          <hr />




          <h3>
            About
          </h3>



          <p>

            {place.description}

          </p>





          {
            place.google_maps && (

              <a

                href={place.google_maps}

                target="_blank"

                rel="noreferrer"

                className="btn btn-success"

              >

                📍 Open Google Maps

              </a>

            )
          }



        </div>


      </div>


    </div>

  );

}


export default PlaceDetails;
