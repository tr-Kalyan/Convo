import { useState } from "react"
import { IoIosArrowBack } from "react-icons/io";

const LoginPage = () => {

    const [currState,setCurrState] = useState("Sign Up")
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio,setBio] = useState("");
    const [isDataSubmitted,setIsDataSubmitted] = useState(false);

    const onSubmitHandler = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (currState === "Sign Up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col transition-all duration-300">
            {/* Logo */}
            {/* <img src="/chat.png" alt="logo" className="w-[min(20vw,100px)]" /> */}
            <div className="flex justify-start items-center">
                        <img src="/chat.png" alt="" className="w-12 sm:w-14 lg:w-18 transition-all duration-300" />
                        <span className="block m-2 font-semibold text-[#133890] text-2xl" >Convo</span>
            </div>
            {/* Login/SignUp form */}

            <form onSubmit={onSubmitHandler} className="bg-gradient-to-bl from-blue-100 via-white to-blue-100 w-1/2 sm:w-2/5 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {currState}
                    {isDataSubmitted && <IoIosArrowBack onClick={() => setIsDataSubmitted(false)} className="w-5 cursor-pointer" />}
                </h2>

                {currState === 'Sign Up'&&  !isDataSubmitted && (
                    <input 
                        onChange ={(e) => setFullName(e.target.value)}
                        value={fullName}
                        type="text" 
                        placeholder="Full Name" 
                        className="p-2 border border-gray-500 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
                        required
                    />
                )}

                {!isDataSubmitted && (
                    <>
                        <input 
                            onChange ={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email" 
                            placeholder="email address" 
                            required
                            className="p-2 border border-gray-500 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        />
                        <input 
                            onChange ={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password" 
                            placeholder="password" 
                            required
                            className="p-2 border border-gray-500 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        />
                    </>
                    
                )}

                {currState === "Sign Up" && isDataSubmitted && (
                    <textarea 
                        onChange={(e) => setBio(e.target.value)}
                        rows={4} 
                        className="p-2 border border-gray-500 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]" placeholder="Bio...">

                    </textarea>
                )}

                <button type="submit" className="bg-blue-600 text-white py-3 rounded-md cursor-pointer border border-slate-900" >
                    {currState === "Sign Up" ? "Create Account" : "Login Now"}
                </button>

                {currState === 'Sign Up' && (<div className="flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" className="transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:ring-voilet-500
                            focus:shadow-[0_0_10px_rgba(59,130,246,1)]"/>
                    <p>Agree to the terms of use & privacy policy</p>
                </div>)}

                <div className="flex flex-col gap-2">
                    {currState === "Sign Up" ? (
                        <p className="text-sm text-slate-600">Already have an account? <span onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}} className="font-medium text-violet-800 cursor-pointer">Login here</span></p>
                    ):(
                        <p className="text-sm text-slate-600">Create an account <span onClick={() => setCurrState("Sign Up")} className="font-medium text-violet-800 cursor-pointer">Click here</span></p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage


{/* <div className="login-container">
    <h2>Log in with</h2>
    <div className="flex gap-2 justify-between">
        <button className="w-32 flex items-center border border-gray-500 px-4 py-1">
            <img src="/google.svg" alt="google logo" className="w-12" />
            Google
        </button>
        <button className="w-32 flex items-center border border-gray-500 px-4 py-1">
            <img src="/apple.svg" alt="google logo" className="w-13"/>
            Apple
        </button>
    </div>
    
</div> */}