import { useState } from "react"
import ChatContainer from "../components/ChatContainer"
import RightSidebar from "../components/RightSidebar"
import Sidebar from "../components/Sidebar"

interface UserType {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    bio: string;
}

const HomePage = () => {

    const [selectedUser,setSelectedUser] = useState<UserType | null>(null);
    return (
        <div className={`w-full h-screen grid grid-cols-1 ${selectedUser ? 
            "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]":"md:grid-cols-2"}`} >
            <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
    )
}

export default HomePage