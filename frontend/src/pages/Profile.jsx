
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();



  useEffect(() => {

    const token = localStorage.getItem("token");


    if (!token) {
      navigate("/login");
      return;
    }


    API.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    .then((response) => {

      console.log("Profile:", response.data);

      setUser(response.data);

    })

    .catch((error) => {

      console.error(
        "Profile Error:",
        error.response?.data || error.message
      );

    })

    .finally(() => {

      setLoading(false);

    });


  }, [navigate]);




  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };




  if (loading) {

    return (
      <h3 className="text-center mt-5">
        Loading Profile...
      </h3>
    );

  }




  if (!user) {

    return (
      <h3 className="text-center mt-5 text-danger">
        Unable to load profile
      </h3>
    );

  }




  return (

    <div className="container mt-5">


      <div className="row justify-content-center">


        <div className="col-md-6">


          <div className="card shadow p-4">


            <h2 className="text-center mb-4">
              👤 My Profile
            </h2>



            <p>
              <strong>Name:</strong>
              {" "}
              {user.full_name}
            </p>



            <p>
              <strong>Email:</strong>
              {" "}
              {user.email}
            </p>



            <p>
              <strong>Phone:</strong>
              {" "}
              {user.phone || "Not added"}
            </p>



            <p>
              <strong>Role:</strong>
              {" "}
              {user.role}
            </p>



            <button
              className="btn btn-danger mt-3"
              onClick={logout}
            >
              Logout
            </button>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Profile;