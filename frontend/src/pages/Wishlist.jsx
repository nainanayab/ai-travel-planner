import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";


const BACKEND_URL = "http://127.0.0.1:8000";


function Wishlist() {


  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);




  const fetchWishlist = async () => {


    const token = localStorage.getItem("token");


    if (!token) {

      setLoading(false);
      return;

    }



    try {


      const response = await API.get(
        "/favorites/"
      );


      console.log(
        "Wishlist Data:",
        response.data
      );


      setWishlist(response.data);



    } catch(error) {


      console.log(
        "Wishlist Error:",
        error.response?.data
      );


    } finally {


      setLoading(false);


    }


  };





  useEffect(() => {

    fetchWishlist();

  }, []);






  const removeWishlist = async (favoriteId) => {


    try {


      await API.delete(
        `/favorites/${favoriteId}`
      );



      alert(
        "Removed from Wishlist ❌"
      );


      fetchWishlist();



    } catch(error) {


      console.log(
        error.response?.data
      );


    }


  };







  if (loading) {


    return (

      <h3 className="text-center mt-5">

        Loading wishlist...

      </h3>

    );


  }







  return (


    <div className="container mt-5">



      <h2 className="text-center mb-4">

        ❤️ My Wishlist

      </h2>





      {
        wishlist.length === 0 ? (


          <h4 className="text-center">

            No favorite places yet.

          </h4>



        ) : (



          <div className="row">



            {
              wishlist.map((item)=>(



                <div
                  className="col-md-4 mb-4"
                  key={item.id}
                >



                  <div className="card shadow h-100">






                    {/* IMAGE */}

                    {
                      item.place?.image_url && (


                        <img

                          src={

                            item.place.image_url.startsWith("http")

                            ?

                            item.place.image_url

                            :

                            `${BACKEND_URL}${item.place.image_url}`

                          }


                          className="card-img-top"


                          alt={item.place.name}



                          style={{

                            height:"220px",

                            objectFit:"cover"

                          }}



                          onError={(e)=>{


                            e.target.src =
                            "https://via.placeholder.com/400x220?text=No+Image";


                          }}


                        />



                      )

                    }







                    <div className="card-body">



                      <h4>

                        {item.place?.name}

                      </h4>




                      <p>

                        📍 {item.place?.location}

                      </p>




                      <p>

                        {item.place?.description}

                      </p>





                      <Link

                        to={`/places/${item.place?.id}`}

                        className="btn btn-primary me-2"

                      >

                        View Details

                      </Link>





                      <button

                        className="btn btn-danger"

                        onClick={()=>removeWishlist(item.id)}

                      >

                        ❌ Remove

                      </button>




                    </div>



                  </div>



                </div>



              ))

            }



          </div>



        )

      }



    </div>


  );


}



export default Wishlist;

