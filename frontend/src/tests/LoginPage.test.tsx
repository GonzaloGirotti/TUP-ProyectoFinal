// src/tests/LoginPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { LoginPage } from '../layout/LoginPage';

const loginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: null,
    token: null,
    loading: false,
    login: loginMock,
    register: vi.fn(),
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

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    navigateMock.mockReset();
  });

  it('submits login data and navigates to /hoy on success', async () => {
    loginMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /entrar|ingresar|iniciar/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'secret12');
    await user.click(submitButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret12',
      });
      expect(navigateMock).toHaveBeenCalledWith('/hoy');
    });
  });

  it('shows backend error when login fails', async () => {
    loginMock.mockRejectedValueOnce({
      response: { data: { message: 'Credenciales inválidas' } },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /entrar|ingresar|iniciar/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).not.toHaveBeenCalledWith('/hoy');
  });
});
