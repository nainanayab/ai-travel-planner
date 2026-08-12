
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");


    try {

      const loginData = new URLSearchParams();

      loginData.append(
        "username",
        email
      );

      loginData.append(
        "password",
        password
      );


      const response = await API.post(
        "/login",
        loginData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );


      console.log(
        "Login Success:",
        response.data
      );


      localStorage.setItem(
        "token",
        response.data.access_token
      );


      setMessage(
        "Login successful!"
      );


      navigate("/profile");


    } catch (error) {


      console.error(
        "Login Error:",
        error.response?.data || error.message
      );


      setMessage(
        error.response?.data?.detail ||
        "Invalid email or password"
      );


    } finally {

      setLoading(false);

    }

  };




  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">


          <div className="card shadow p-4">


            <h2 className="text-center mb-4">
              🔐 Login
            </h2>



            {
              message && (

                <div className="alert alert-info text-center">
                  {message}
                </div>

              )
            }



            <form onSubmit={handleLogin}>


              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>


                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>




              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>


                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>




              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >

                {
                  loading
                    ? "Logging in..."
                    : "Login"
                }

              </button>


            </form>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Login;
