// src/tests/RegisterPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { RegisterPage } from '../layout/RegisterPage';

const registerMock = vi.fn();
const navigateMock = vi.fn();

const getInputByLabel = (labelText: RegExp): HTMLInputElement => {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector('input');
  if (!input) {
    throw new Error('Input not found for label');
  }
  return input as HTMLInputElement;
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: null,
    token: null,
    loading: false,
    login: vi.fn(),
    register: registerMock,
    logout: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    registerMock.mockReset();
    navigateMock.mockReset();
  });

  it('submits registration data and navigates to /hoy on success', async () => {
    registerMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(getInputByLabel(/nombre de usuario/i), 'Daro');
    await user.type(getInputByLabel(/^email$/i), ' Test@Example.COM ');
    await user.type(getInputByLabel(/fecha de nacimiento/i), '1990-01-02');
    await user.type(getInputByLabel(/^contrase/i), 'secret12');
    await user.type(getInputByLabel(/confirmar contrase/i), 'secret12');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        nombre_usuario: 'Daro',
        email: 'test@example.com', // 👈 ojo: RegisterPage tiene que normalizar (trim + lowercase)
        password: 'secret12',
        fecha_nacimiento: '1990-01-02T00:00:00.000Z',
      });
      expect(navigateMock).toHaveBeenCalledWith('/hoy');
    });
  });

  it('shows an error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(getInputByLabel(/nombre de usuario/i), 'Tester');
    await user.type(getInputByLabel(/^email$/i), 'tester@example.com');
    await user.type(getInputByLabel(/fecha de nacimiento/i), '1995-05-05');
    await user.type(getInputByLabel(/^contrase/i), 'secret12');
    await user.type(getInputByLabel(/confirmar contrase/i), 'mismatch');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/no coinciden/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('shows backend error when register fails', async () => {
    registerMock.mockRejectedValueOnce({
      response: { data: { message: 'El email ya está registrado' } },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(getInputByLabel(/nombre de usuario/i), 'Tester');
    await user.type(getInputByLabel(/^email$/i), 'tester@example.com');
    await user.type(getInputByLabel(/fecha de nacimiento/i), '1995-05-05');
    await user.type(getInputByLabel(/^contrase/i), 'secret12');
    await user.type(getInputByLabel(/confirmar contrase/i), 'secret12');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(
      await screen.findByText(/el email ya está registrado/i),
    ).toBeInTheDocument();

    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
