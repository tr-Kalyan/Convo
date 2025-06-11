import assets,{userDummyData} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";


interface SidebarProps {
    selectedUser: {
        _id: string;
        email: string;
        fullName: string;
        profilePic: string;
        bio: string;
    } | null;
    setSelectedUser: (user: {
        _id: string;
        email: string;
        fullName: string;
        profilePic: string;
        bio: string;
    }) => void;
}

const Sidebar:React.FC<SidebarProps> = ({selectedUser,setSelectedUser}) => {
    
    const navigate = useNavigate()
    
    return(
        <div className={`bg-white h-full p-5 border-r border-stone-500 overflow-y-scroll text-black ${selectedUser ? "max-md:hidden":""}`}>
            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/chat.png" alt="" className="max-w-40 w-10 " />
                        <span className="m-2 font-semibold text-green-500 text-xl" >Convo</span>
                    </div>
                    
                    <div className="relative py-2 group" >
                        <BsThreeDotsVertical  className="max-h-5 cursor-pointer text-xl" />
                        <div 
                            className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-neutral-600 border border-gray-600 text-gray-100 hidden group-hover:block"
                        >
                            <p onClick={() => navigate('/profile')} className="hover:bg-neutral-400 rounded-lg cursor-pointer px-2 py-1 text-center text-sm">Edit Profile</p>
                            <hr className="my-2 border-t border-gray-500" />
                            <p className="hover:bg-neutral-400 rounded-lg px-2 py-1 cursor-pointer text-center text-sm">Logout</p>
                        </div>
                    </div>
                </div>

                {/* search icon and input field */}
                <div className="bg-gray-200 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                    <IoSearch className="w-5 " />
                    <input type="text" className=" border-none outline-none text-sm placeholder-[#c9c9c9] flex-1" placeholder="Search User..." />
                </div>

                {/* User profile */}
                <div className="flex flex-col mt-5">
                    {userDummyData.map((user,index) => (
                        <div key={index} onClick={() => {setSelectedUser(user)}} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-gray-300'}`}>
                            <img 
                                src={user?.profilePic||assets.avatar_icon} alt=""
                                className="w-[35px] aspect-[1/1] rounded-full"
                            />
                            <div className="flex flex-col leading-5">
                                <p>{user.fullName}</p>
                                {
                                    index < 3 ?
                                    <span className="text-green-400 text-xs">Online</span>:
                                    <span className="text-neutral-400 text-xs">Offline</span>
                                }
                            </div>
                            {
                                index > 2 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full text-white bg-green-500">{index}</p>
                            }
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Sidebar