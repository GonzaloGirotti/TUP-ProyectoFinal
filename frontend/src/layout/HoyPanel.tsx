import ChartPanel from "../components/MacrosChart";

const mockData = {kcal: 2000 , ejercicio: 200, agua: 2}

export function HoyPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between gap-2">
        <div className="panel-item w-1/2">
          <div className="flex justify-between flex-wrap items-center w-full ">
            <h2>Calories</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="red"
          >
            <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
          </svg>
         
          </div>
            <h4 className="font-bold">2000 kcal</h4>
       
            <p className="font-light">Restante = objetivo - alimento + ejercicio</p>
        </div>

        <div className="panel-item w-1/4">
        <div className="flex justify-between flex-wrap items-center w-full">

          <h2>Ejercicio</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="orange"
          >
            <path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z" />
          </svg>
        </div>
          <h4>200 kcal</h4>
        </div>
        <div className="panel-item w-1/4">
        <div className="flex justify-between flex-wrap items-center w-full">
          
          <h2>Agua</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="blue"
          >
            <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z" />
          </svg>
        </div>
          <h4>2 L</h4>
        </div>
      </div>
      <div className="panel-item">
        <ChartPanel macros={{ protein: 300, carbs: 400, fat: 300 }} />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="panel-item w-1/2">
          <h2>Peso</h2>
          <h4>80kg</h4>
        </div>
        <div className="panel-item w-1/2">
          <h2>IMC</h2>
          <h4>30</h4>
        </div>
      </div>
    </div>
  );
}
