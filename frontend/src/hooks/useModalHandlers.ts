import { useState } from 'react';
import type { SectionKey } from '../layout/types';

export const useModalHandlers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<SectionKey | null>(null);
  const [guardando, setGuardando] = useState(false);

  const abrirModal = (seccion: SectionKey) => {
    setSeccionActiva(seccion);
    setModalOpen(true);
    setGuardando(false);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSeccionActiva(null);
  };

  return {
    modalOpen,
    seccionActiva,
    guardando,
    setGuardando,
    abrirModal,
    cerrarModal,
  };
};