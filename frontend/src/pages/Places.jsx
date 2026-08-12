import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";


const BACKEND_URL = "http://127.0.0.1:8000";


function Places() {

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    API.get("/places/")
      .then((response) => {

        console.log("Places:", response.data);

        setPlaces(response.data);

      })
      .catch((error) => {

        console.log(
          "Places Error:",
          error
        );

      })
      .finally(() => {

        setLoading(false);

      });


  }, []);





  const addWishlist = async (placeId) => {


    const token = localStorage.getItem("token");


    if (!token) {

      alert("Please login first ❤️");

      return;

    }



    try {


      await API.post(
        "/favorites/",
        {
          place_id: placeId
        },
        {
          headers: {

            Authorization:
              `Bearer ${token}`

          }
        }
      );



      alert(
        "Added to Wishlist ❤️"
      );


    }
    catch(error) {


      console.log(
        "Wishlist Error:",
        error.response?.data
      );


      alert(
        "Already added or error occurred"
      );


    }


  };





  if (loading) {

    return (

      <h3 className="text-center mt-5">

        Loading places...

      </h3>

    );

  }





  return (


    <div className="container mt-5">


      <h2 className="text-center mb-4">

        🏝️ Explore Places

      </h2>




      <div className="row">


        {
          places.map((place) => (


            <div
              className="col-md-4 mb-4"
              key={place.id}
            >



              <div className="card shadow h-100">



                {
                  place.image_url && (

                    <img

                      src={
                        place.image_url.startsWith("http")
                        ? place.image_url
                        : `${BACKEND_URL}${place.image_url}`
                      }

                      className="card-img-top"

                      alt={place.name}

                      style={{
                        height:"220px",
                        objectFit:"cover"
                      }}

                    />

                  )

                }





                <div className="card-body">


                  <h4>

                    {place.name}

                  </h4>



                  <p>

                    📍 {place.location}

                  </p>



                  <p>

                    {place.description}

                  </p>





                  <Link

                    to={`/places/${place.id}`}

                    className="btn btn-primary me-2"

                  >

                    View Details

                  </Link>





                  <button

                    className="btn btn-danger"

                    onClick={() =>
                      addWishlist(place.id)
                    }

                  >

                    ❤️ Wishlist

                  </button>



                </div>



              </div>


            </div>


          ))
        }


      </div>


    </div>


  );


}


export default Places;