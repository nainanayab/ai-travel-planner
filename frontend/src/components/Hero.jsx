import { Link } from "react-router-dom";


function Hero() {

  return (

    <section className="bg-primary text-white py-5">


      <div className="container">


        <div className="row align-items-center">


          {/* Hero Text */}

          <div className="col-lg-7 text-center text-lg-start">


            <h1 className="display-4 fw-bold mb-3">

              Explore Pakistan with AI

            </h1>



            <p className="lead mb-4">

              Discover beautiful destinations,
              explore historical places,
              plan your trips, and get
              AI-powered travel recommendations.

            </p>




            <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">


              <Link

                to="/places"

                className="btn btn-light btn-lg px-4"

              >

                Explore Places

              </Link>




              <Link

                to="/chat"

                className="btn btn-outline-light btn-lg px-4"

              >

                🤖 Plan Your Trip

              </Link>



            </div>



          </div>





          {/* Hero Visual */}


          <div className="col-lg-5 text-center mt-4 mt-lg-0">


            <div className="display-1">

              🕌

            </div>



            <h3 className="mt-3">

              Discover. Explore. Travel.

            </h3>



          </div>



        </div>


      </div>


    </section>


  );

}


export default Hero;