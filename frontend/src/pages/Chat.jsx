import { useState } from "react";
import API from "../api";


function Chat() {


  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(false);





  const sendMessage = async (e) => {


    e.preventDefault();



    if (!message.trim()) {

      return;

    }





    const userMessage = {

      sender: "user",

      text: message

    };





    setChat((prev) => [

      ...prev,

      userMessage

    ]);





    setMessage("");

    setLoading(true);





    try {



      const response = await API.post(

        "/chat",

        {

          message: userMessage.text

        }

      );





      setChat((prev) => [

        ...prev,


        {

          sender: "ai",

          text:
            response.data.reply ||
            response.data.message ||
            "No response received."

        }


      ]);





    } catch (error) {



      console.error(

        "Chat Error:",

        error.response?.data ||
        error.message

      );





      setChat((prev) => [

        ...prev,


        {

          sender: "ai",

          text:
            "Sorry, AI service is unavailable."

        }


      ]);




    } finally {



      setLoading(false);



    }


  };








  return (


    <div className="container mt-5">



      <h2 className="text-center mb-4">

        🤖 AI Tourism Assistant

      </h2>







      <div className="card shadow p-4">





        <div

          style={{

            height: "350px",

            overflowY: "auto"

          }}

          className="mb-3"

        >






          {
            chat.length === 0 && (


              <p className="text-muted text-center">

                Ask me about places, trips, and travel plans.

              </p>


            )
          }







          {
            chat.map((item, index) => (



              <div

                key={index}

                className={

                  item.sender === "user"

                  ? "text-end mb-3"

                  : "text-start mb-3"

                }

              >







                <div

                  className={

                    item.sender === "user"

                    ? "badge bg-primary p-3"

                    : "badge bg-success p-3"

                  }


                  style={{

                    whiteSpace: "pre-line",

                    textAlign: "left",

                    display: "inline-block",

                    maxWidth: "80%",

                    fontSize: "15px",

                    lineHeight: "1.6"

                  }}

                >


                  {item.text}


                </div>






              </div>




            ))
          }







          {
            loading && (


              <p className="text-muted">

                AI is thinking...

              </p>


            )
          }






        </div>









        <form onSubmit={sendMessage}>


          <div className="input-group">





            <input


              type="text"


              className="form-control"


              placeholder="Ask about tourism..."


              value={message}


              onChange={(e) =>

                setMessage(e.target.value)

              }


            />






            <button


              className="btn btn-primary"


              type="submit"


            >

              Send


            </button>





          </div>


        </form>





      </div>




    </div>



  );


}



export default Chat;
