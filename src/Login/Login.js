import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignInSignUp = () => {
 const [isSignedIn, setisSignedIn] = useState(true);
  const [frmdta, setfrmdta] = useState({
    name: "",
   email: "",
    password: "",
    confirmPassword: "",
   phoneNumber: "",
   address: "",
   city: "",
   state: "",
    accountType: "regular",
  });

 const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const toggleSignInSignUp = () => {
   setisSignedIn((prevState) => !prevState);
  setError(""); 
    setSuccess(""); 
  };

 const handleChange = (e) => {
  const { name, value } = e.target;
    setfrmdta({ ...frmdta, [name]: value });
  };
 const handleClick = () => {
  navigate('/admin');}

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!isSignedIn && frmdta.password !== frmdta.confirmPassword) {
    setError("Password mismatch");
    return;
  }

 const endpoint = isSignedIn
    ? "http://localhost:8081/customers/login"
   : "http://localhost:8081/customers/signup";
   const payload = isSignedIn
    ? { email: frmdta.email, password: frmdta.password }
     : {
       name: frmdta.name,
      email: frmdta.email,
          password: frmdta.password,
       phoneNumber: frmdta.phoneNumber,
         address: frmdta.address,
        city: frmdta.city,
         state: frmdta.state,
       accountType: frmdta.accountType,
       };
   try {
     const response = await axios.post(endpoint, payload);
    if (isSignedIn) {
       const { token, customerId, name, email } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem(
       "customerDetails",
      JSON.stringify({ customerId, name, email })
     );
     
    setSuccess("Sign In Successful!");
        navigate("/dashboard");
    } else {
      
       setfrmdta({
       name: "",
         email: "",
        password: "",
         confirmPassword: "",
        phoneNumber: "",
         address: "",
       city: "",
      state: "",
        accountType: "regular",
       });
     setSuccess("Sign Up Successful! Please sign in.");
      setTimeout(() => {
         navigate("/");
       }, 2000); 
     }
    setError(""); 
   } catch (error) {
     setError(error.response?.data?.message || "Try again.");
    setSuccess(""); 
    }
  };
  return (
   <div className="flex items-center  h-screen justify-center bg-gray-200">
   <div className="w-full  rounded-lg shadow-lg flex max-w-4xl bg-white overflow-hidden flex-col md:flex-row">
        <div
       className={`w-full md:w-1/2 p-8 flex flex-col justify-center ${
            isSignedIn ? "bg-orange-600" : "bg-orange-600"
         } text-white  duration-500 transition-all ease-in-out`}
       >
         <h2 className="text-3xl  mb-4 font-bold">
            {isSignedIn ? "Hello, Friend!" : "Welcome Back!"}
      </h2>
         <p className="mb-8">
       {isSignedIn
              ? "Fill up personal information and start your journey with us."
           : "To keep connected with us, please login with your personal info."}
         </p>
          <button
            className="py-2  bg-white text-orange-600 px-6 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out"
          onClick={toggleSignInSignUp}
         >
            {isSignedIn ? "Sign Up" : "Sign In"}
        </button>
          <p onClick={handleClick} className="mt-4  text-sm cursor-pointer hover:underline" style={{ color: 'white' }}>
  If you are admin click here to login.
   </p>
      </div>
        <motion.div
         className="w-full  flex flex-col md:w-1/2 p-8 justify-center bg-white"
      initial={{ opacity: 0, x: isSignedIn ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
     >
          <h2 className="text-2xl font-bold text-center mb-4">
         {isSignedIn ? "Sign In to Account" : "Create an Account"}
          </h2>
     
          {error && (
         <div className="text-red-500  mb-4 text-center">
             <strong>{error}</strong>
            </div>
          )}
      {success && (
        <div className="text-green-500 mb-4 text-center">
             <strong>{success}</strong>
         </div>
          )}
     <form className="space-y-4" onSubmit={handleSubmit}>
            {!isSignedIn && (
              <>
       <input
                 type="text"
             name="name"
                 placeholder="Full Name"
             value={frmdta.name}
             onChange={handleChange}
                required
             className="w-full  rounded-md px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
                <input
         type="text"
               name="address"
             placeholder="Address"
             value={frmdta.address}
                 onChange={handleChange}
                required
              className="w-full  focus:outline-none px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-600"
                />
            <input
                 type="text"
                  name="city"
              placeholder="City"
                 value={frmdta.city}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-2 border rounded-md  focus:ring-2 focus:outline-none focus:ring-orange-600"
                />
        <input
                type="text"
               name="state"
             placeholder="State"
                  value={frmdta.state}
             onChange={handleChange}
               required
                 className="w-full px-4  rounded-md focus:outline-none py-2 border focus:ring-2 focus:ring-orange-600"
               />
             <input
                 type="tel"
                name="phoneNumber"
                  placeholder="Phone Number"
                  value={frmdta.phoneNumber}
                  onChange={handleChange}
                 required
          className=" border rounded-md focus:outline-none w-full px-4 py-2 focus:ring-2 focus:ring-orange-600"
               />
              </>
          )}
            <input
           type="email"
            name="email"
             placeholder="Email"
             value={frmdta.email}
              onChange={handleChange}
              required
       className="w-full px-4 py-2 border focus:outline-none focus:ring-2 rounded-md  focus:ring-orange-600"
            />
            <input
          type="password"
             name="password"
              placeholder="Password"
           value={frmdta.password}
              onChange={handleChange}
             required
          className="w-full px-4  focus:outline-none focus:ring-2 py-2 border rounded-md focus:ring-orange-600"
         />
         {!isSignedIn && (
           <input
             type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
           value={frmdta.confirmPassword}
           onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            )}
            <button
       type="submit"
            className="w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-all duration-300 ease-in-out"
          >
         {isSignedIn ? "Sign In" : "Sign Up"}
      </button>
          </form>
   </motion.div>
    </div>
 </div>
  );
};

export default SignInSignUp;
