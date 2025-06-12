import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {

    const [selectedImg, setSelectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name,setName] = useState("Martin");
    const [bio,setBio] = useState("Hi Everyone, I am using Convo")


    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();
        navigate("/")


    }
    return (
        <div className=" min-h-screen flex items-center justify-center">
            {/* User profile form */}
            <div className=" max-w-5/6 min-w-3/6  max-w-2xl border-2 border-slate-800 flex-col items-center justify-between max-sm:flex-col-reverse rounded-lg">
                <div className="flex justify-start items-center">
                        <img src="/chat.png" alt="" className="max-w-6 " />
                        <span className="m-2 font-semibold text-[#133890] text-xl" >Convo</span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    <h2 className="text-lg md:text-xl text-center">Profile Details</h2>
                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                        <input 
                            onChange={(e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) setSelectedImg(file);
                            }} 
                            type="file" id="avatar" accept=".png, .jpeg, .jpg" hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg): assets.avatar_icon} alt="profile picture" 
                            className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
                        />
                        Upload profile image
                    </label>
                    <input type="text" required placeholder="Your name" 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="
                            p-2
                            border border-slate-800
                            rounded-md
                            transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)] 
                        "
                    />
                    <textarea 
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Profile bio..." 
                        required
                        className="p-2 border border-slate-800 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    >

                    </textarea>
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-full text-lg cursor-pointer">
                        Save
                    </button>
                </form>
                {/* <img className="max-w-46 aspect-square rounded-lg mx-10 max-sm:mt-10" src="chat.png" alt="profile picture"  /> */}
                
            </div>
        </div>
    )
}

export default ProfilePage