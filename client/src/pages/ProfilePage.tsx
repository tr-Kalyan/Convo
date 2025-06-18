import { useState,useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


axios.defaults.withCredentials = true; 
const ProfilePage = () => {

    const authContext = useContext(AuthContext);
    if (!authContext) {
        console.error("Auth context not available");
        return;
    }
   
    const { authUser,setAuthUser,updateProfile } = authContext;

    const [selectedImg, setSelectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [bio,setBio] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (authUser){
            setName(authUser.fullName || "")
            setBio(authUser.bio || "")
        }
    },[authUser])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let payload: Partial<AuthUser> = { fullName: name, bio };

            if (selectedImg) {
                const reader = new FileReader();
                reader.onload = async () => {
                    payload.profilePic = reader.result as string;

                    const updatedUser = await updateProfile(payload);
                    if (updatedUser) {
                        navigate("/profile"); // or wherever you want
                    }
                };
                reader.readAsDataURL(selectedImg);
            } else {
                const updatedUser = await updateProfile(payload);
                if (updatedUser) {
                    navigate("/profile");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    
    return (
        <div className=" min-h-screen flex items-center justify-center p-2">
            {/* User profile form */}
            <div className="w-full max-w-[500px] bg-[#e3eaf2]  border-2 border-[#2d1e2f] flex-col items-center justify-between rounded-lg">
                <div className="flex justify-start items-center">
                        <img src="/chat.png" alt="" className="max-w-6 " />
                        <span className="m-2 font-semibold text-[#1a2238] text-md" >Convo</span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    
                    <div>
                        <img 
                            src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon} 
                            alt="Profile preview" 
                            className="w-25 h-25 rounded-full object-cover"
                        />
                        <h2 className="text-lg font-semibold md:text-xl text-center">Edit Profile</h2>
                    </div>
                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                        <input 
                            onChange={(e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) setSelectedImg(file);
                            }} 
                            type="file" id="avatar" accept=".png, .jpeg, .jpg" hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg): authUser?.profilePic} alt="profile picture" 
                            className={`w-12 h-12 rounded-full`}
                        />
                        Upload profile image
                    </label>
                    <input type="text" required placeholder="Your name" 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="
                            bg-[#f5f7fa]
                            p-2
                            border border-slate-800
                            rounded-md
                            transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)] 
                        "
                    />
                    <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Profile bio..." 
                        required
                        className="bg-[#f5f7fa] p-2 border border-slate-800 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none 
                            focus:shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    >

                    </textarea>
                    <button type="submit" disabled={isSubmitting}
                        className={`bg-[#1a2238] font-medium text-white p-2 rounded-full text-lg cursor-pointer 
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </form>
                {/* <img className={`max-w-46 aspect-square rounded-lg mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`} src={authUser?.profilePic ||"chat.png"} alt="profile picture"  /> */}
                
            </div>
        </div>
    )
}

export default ProfilePage