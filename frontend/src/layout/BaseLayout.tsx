import "./baseLayout.css";
import { Menu } from "../components/menu/Menu";
import { HoyPanel } from "./HoyPanel";
import { useState } from "react";

const BaseLayout = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="base">
      <aside className="flex flex-col gap-4 p-2  bg-zinc-900">
        <div className="flex justify-center p-4 ">
          <div className="rounded-full bg-amber-200 h-30 w-30">Avatar</div>
        </div>
        <hr />
        <Menu />
        <hr />
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
        </div>
      </aside>

      <header className="flex justify-between items-center p-2">
        <h4>{currentDate.toLocaleString()}</h4>
        <span className="h-2/3 w-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="auto"
            viewBox="0 -960 960 960"
            width="100%"
            fill="white"
          >
            <path d="M480-480q-17 0-28.5-11.5T440-520v-320q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v320q0 17-11.5 28.5T480-480Zm0 360q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-61 20-118.5T198-704q11-14 28-13.5t30 13.5q11 11 10 27t-11 30q-27 36-41 79t-14 88q0 117 81.5 198.5T480-200q117 0 198.5-81.5T760-480q0-46-13.5-89.5T704-649q-10-13-11-28.5t10-26.5q12-12 29-12.5t28 12.5q39 48 59.5 105T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Z" />
          </svg>
        </span>
      </header>
      <main className="m-4">
        <HoyPanel />
      </main>
    </div>
  );
};

export default BaseLayout;
