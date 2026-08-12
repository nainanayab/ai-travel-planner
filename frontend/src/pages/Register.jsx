
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: ""
  });


  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };




  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");



    try {


      const response = await API.post(
        "/register",
        form
      );


      console.log(
        "Register Success:",
        response.data
      );


      setMessage(
        "Registration successful! Redirecting to login..."
      );


      setTimeout(() => {

        navigate("/login");

      }, 800);



    } catch (error) {


      console.error(
        "Register Error:",
        error.response?.data || error.message
      );


      setMessage(
        error.response?.data?.detail ||
        "Registration failed"
      );


    } finally {

      setLoading(false);

    }

  };




  return (

    <div className="container mt-5">


      <div className="row justify-content-center">


        <div className="col-md-6">


          <div className="card shadow p-4">


            <h2 className="text-center mb-4">
              📝 Create Account
            </h2>




            {
              message && (

                <div className="alert alert-info text-center">
                  {message}
                </div>

              )
            }




            <form onSubmit={handleSubmit}>


              <input
                className="form-control mb-3"
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                required
              />



              <input
                className="form-control mb-3"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />



              <input
                className="form-control mb-3"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />



              <input
                className="form-control mb-3"
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />




              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >

                {
                  loading
                    ? "Creating Account..."
                    : "Register"
                }

              </button>



            </form>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Register;
