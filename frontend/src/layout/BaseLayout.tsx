import "./baseLayout.css";
import { Menu } from "../components/menu/Menu";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

const BaseLayout = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="base">
      <aside className="flex flex-col gap-4 p-2 bg-zinc-900">
        <div className="flex justify-center p-4 w-full" >
          <img src="/avatar.jpg" alt="avatar " />
        </div>
    
        <Menu />
     

      </aside>

    <Header/>

      <main className="flex m-4">
        {/* Aquí se renderiza la vista según la ruta */}
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
