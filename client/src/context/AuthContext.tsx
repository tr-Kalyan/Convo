import { useState,createContext,useEffect } from "react";
import type {ReactNode} from 'react'
import axios, {  AxiosError } from 'axios'
import Cookie from 'js-cookie'
import toast from "react-hot-toast";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  bio:string;
  profilePic:string;
  // add other fields
}




interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  axios: typeof axios;
  authUser: AuthUser | null;
setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  onlineUsers: any[];
  socket: Socket | null;
  login: (state: string, credentials: Record<string, string>) => Promise<void>;
  logout: () => void;
  updateProfile: (body: Partial<AuthUser>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);




export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [token,setToken] = useState<string | null | undefined>(Cookie.get("token"))
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    const navigate = useNavigate();

    // check if user is authenticated and if so, set the user data and connect the socket

    const checkAuth = async () => {
        try{
            const {data} = await axios.get("/api/auth/check",)

            if (data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        }
        catch(err){
            console.log("check auth from Auth context",err)
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Something went wrong");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    //  login function to handle user authentication and socket connection
    const login = async (state: string, credentials: Record<string, string>) => {
        try{
            const {data} = await axios.post(`/api/auth/${state}`,credentials)
            
            if (data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;

                setToken(data.token);
                Cookie.set("token",data.token)
                toast.success(data.message)
                navigate("/profile")
            }
        }
        catch(err){
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Something went wrong");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    //  logout function to handle user logout and socket disconnection

    const logout = async() => {
        Cookie.remove("token");
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out succesfully")
        socket?.disconnect()
    }

    // update profile function to handle user profile updates

    const updateProfile = async (body: Partial<AuthUser>) => {
        try{
            const {data} = await axios.put("/api/auth/update-profile",body);

            console.log("from context update profile funciton",data)
            if (data.success){
                setAuthUser(data.user)
                toast.success("Profile updated successfully")
                return data.user;
            }
        }
        catch(err){
            console.log(err)
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Something went wrong");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    // connect socket function to handle socket connection and online users updates

    const connectSocket = (userData: AuthUser) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds: any[]) => {
            setOnlineUsers(userIds);
        });     
    };


    const value: AuthContextType = {
        axios,
        authUser,
        setAuthUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };


    useEffect(() => {
        if (token){

            // Set the authorization token in the default headers for all Axios requests.
            // This ensures that every subsequent HTTP request made with Axios
            // will automatically include the 'token' header with the provided value.
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    },[])

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}