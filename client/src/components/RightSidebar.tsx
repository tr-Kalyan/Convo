import assets, { imagesDummyData } from "../assets/assets";

interface SidebarProps {
    selectedUser: {
        _id: string;
        email: string;
        fullName: string;
        profilePic: string;
        bio: string;
    } | null;
}

const RightSidebar:React.FC<SidebarProps> = ({selectedUser}) => {
    return selectedUser &&(
        <div className={`border-l border-gray-600 w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden":""}`}>
            <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="profile picture" 
                    className="w-20 aspect-[1/1] rounded-full"
                />
                <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
                    <p className="w-2 h-2 rounded-full bg-green-500"></p>
                    {selectedUser.fullName}
                </h1>
                <p className="px-10 mx-auto">{selectedUser.bio}</p>
            </div>
            <hr className="border-[#ffffff50] my-4"/>
            <div className="px-5 text-xs">
                <p>Media</p>
                <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                    {imagesDummyData.map((url,index) => (
                        <div key={index} onClick={() => window.open(url)} className="cursor-pointer rounded">
                            <img src={url} alt="url" className="h-full rounded-md" />
                        </div>
                    ))}
                </div>
                <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white bg-neutral-600 border-none tex-sm font-light py-2 px-20 rounded-full cursor-pointer">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default RightSidebar