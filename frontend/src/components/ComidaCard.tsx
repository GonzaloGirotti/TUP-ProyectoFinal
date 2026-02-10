import React from 'react';

// Interfaz para el ítem individual
export interface ItemDiario {
    id_relacion: number;
    texto: string;
}

interface ComidaCardProps {
    titulo: string;
    items: ItemDiario[];
    onAgregar: () => void;
    onEliminar: (id: number) => void;
    tipo?: 'comida' | 'agua' | 'ejercicio' | 'peso'; // Opcional, por si queremos estilos distintos
}

export const ComidaCard: React.FC<ComidaCardProps> = ({
    titulo,
    items,
    onAgregar,
    onEliminar,
    tipo = 'comida'
}) => {
    // Colores según el tipo de tarjeta
    const isAgua = tipo === 'agua';
    const isEjercicio = tipo === 'ejercicio';
    const isPeso = tipo === 'peso';
    let headerColor = "text-slate-200";
    let dotColor = "bg-emerald-500";
    let btnColor = "text-emerald-400 border-emerald-500/30";

    if (isAgua) {
        headerColor = "text-blue-400";
        dotColor = "bg-blue-500";
        btnColor = "text-blue-400 border-blue-500/30";
    } else if (isEjercicio) {
        headerColor = "text-orange-400";
        dotColor = "bg-orange-500";
        btnColor = "text-orange-400 border-orange-500/30";
    } else if (isPeso) {
        headerColor = "text-yellow-400";
        dotColor = "bg-yellow-500";
        btnColor = "text-yellow-400 border-yellow-500/30";
    }

    return (
        <article className="bg-slate-800 rounded-lg p-5 border border-slate-700 min-h-[120px] transition-colors hover:border-slate-600">
            <header className="flex items-center justify-between mb-3">
                <h3 className={`text-base font-semibold capitalize ${headerColor}`}>
                    {titulo}
                </h3>
                <button
                    type="button"
                    onClick={onAgregar}
                    className={`bg-slate-700 hover:bg-slate-600 border rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors shadow-sm ${btnColor}`}
                    title={`Agregar a ${titulo}`}
                >
                    +
                </button>
            </header>

            {items.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">Sin registros.</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {items.map((item, index) => (
                        <li
                            key={`${titulo}-${index}`}
                            className="flex items-center justify-between gap-2 text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800 group"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}></span>
                                <span className="truncate" title={item.texto}>
                                    {item.texto}
                                </span>
                            </div>
                            <button
                                onClick={() => onEliminar(item.id_relacion)}
                                className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Eliminar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
};