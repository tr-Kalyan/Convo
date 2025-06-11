import {useRef,useEffect,useState} from 'react';
import assets, { messagesDummyData } from '../assets/assets'
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import { BsInfoCircle } from "react-icons/bs";
import { FormatMessageTime } from '../lib/utils';
import { CiImageOn } from "react-icons/ci";


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
    } | null) => void;
}


const ChatContainer:React.FC<SidebarProps> = ({selectedUser,setSelectedUser}) => {

    const [mediaPreview,setMediaPreview] = useState<string | null>(null);
    const [mediaType,setMediaType] = useState< "image" | "video" | null>(null);
    const scrollEnd = useRef<HTMLDivElement | null>(null);



    // upload file type
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file){
            const url = URL.createObjectURL(file);

            if (file.type.startsWith("image")){
                setMediaType("image")
            }else if (file.type.startsWith("video")){
                setMediaType("video");
            }
            setMediaPreview(url)
        }
    }
    useEffect(() => {
        if (scrollEnd.current){
            scrollEnd.current.scrollIntoView({behavior:"smooth"})
        }
    },[])

    return selectedUser ?(
        <div className="h-full overflow-scroll relative">
            {/* --- header --- */}
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img src={selectedUser.profilePic} alt="" className="w-8 rounded-full"/>
                <p className="flex-1 text-lg text-black flex items-center gap-2">
                    {selectedUser.fullName}
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </p>
                <IoIosArrowBack onClick={() => setSelectedUser(null)} className="text-xl md:hidden max-w-7"/>
                
                <BsInfoCircle size={45} className="max-md:hidden max-w-5" />
            </div>

            {/* --- chat area --- */}
            <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
                {messagesDummyData.map((msg,index) => (
                    <div key={index}
                        className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}
                    >
                        {msg.image ? (
                            <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" />
                        ):(
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-gray-300 ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none':'rounded-bl-none'}`}>{msg.text}</p>
                        )}
                        <div className="text-center text-xs">
                            <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : selectedUser.profilePic} alt="" className="w-7 rounded-full"/>
                            <p className="text-gray-500">{FormatMessageTime(msg.createdAt)}</p>
                        </div>
                        
                    </div>
                ))}
                <div ref={scrollEnd}>

                </div>
            </div>

            {/* --- bottom area --- */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
                <div className="flex-1 flex items-center bg-gray-200 px-3 rounded-full">
                    <input type="text" placeholder="send a message"
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none placeholder-gray-400"
                    />
                    <input type="file" id="image" accept="image/*, video/mp4, video/webm" hidden onChange={handleFileChange} />
                    <label htmlFor='image'>
                        <CiImageOn className="text-xl w-5 mr-2 cursor-pointer"/>
                    </label>

                    {/* Preview selected media */}
                    {mediaPreview && (
                        <div className="absolute bottom-16 left-3 max-w-[200px]">
                            {mediaType === "image" ? (
                                <img src={mediaPreview} alt="preview" className="rounded shadow-md" />
                            ) : (
                                <video src={mediaPreview} controls className="rounded shadow-md" />
                            )}
                        </div>
                    )}
                </div>
                <IoMdSend className="w-7 cursor-pointer text-2xl" />
            </div>
        </div>
    ):(
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
            <img src="chat.png" alt="" className="max-w-16" />
            <p className="text-lg font-medium text-black">Chat anytime, anywhere</p>
        </div>
        
    )
}

export default ChatContainer