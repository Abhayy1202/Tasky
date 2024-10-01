import { useState } from 'react'
import './App.css'
import { useDispatch } from "react-redux";
// import { login, logout } from "./store/authSlice";
import Header  from "./components/Header.jsx";
import { Outlet } from "react-router-dom";


function App() {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between ">
      <div className=" h-screen flex-col w-full flex">
    
          <Header />
          <main className=" bg-gradient-to-r from-[#C9C19F] to-[#96897B] dark:from-[#151515] dark:to-[#091a55] flex-grow overflow-auto h-full">
            <Outlet />
          </main>
        
       
      </div>
    </div>
  ) : null;
}

export default App
