import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { AuthContext } from '../../contexts/AuthContext/AuthContext';

import styles from './styles.module.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!username && !password) {
      setMessage(
        'Preencha o usuário e a senha',
      );

      return;
    }

    if (!username) {
      setMessage(
        'Preencha o usuário',
      );

      return;
    }

    if (!password) {
      setMessage(
        'Preencha a senha',
      );

      return;
    }

    const isValidLogin = await login(
      username,
      password,
    );

    if (isValidLogin) {
      setMessage('Login realizado com sucesso!');

      navigate('/home/');

      return;
    }

    setMessage('Usuário ou senha inválidos');
  }

  function handleRegister() {
  navigate('/register/');
}

  function handleForgotPassword() {
  navigate('/forgot-password/');
}

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Chronos Pomodoro</h1>

        <h2>Login</h2>

        <form
          onSubmit={handleLogin}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <label htmlFor='username'>Usuário</label>

            <input
              id='username'
              type='text'
              value={username}
              onChange={event =>
                setUsername(event.target.value)
              }
              placeholder='Digite seu usuário'
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='password'>Senha</label>

            <input
              id='password'
              type='password'
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              placeholder='Digite sua senha'
            />
          </div>

          <button
            type='submit'
            className={styles.loginButton}
          >
            Entrar
          </button>
        </form>

        {message && (
          <p className={styles.message}>{message}</p>
        )}

        <div className={styles.actions}>
          <button
            type='button'
            onClick={handleRegister}
          >
            Não tem conta? Cadastre-se
          </button>

          <button
            type='button'
            onClick={handleForgotPassword}
          >
            Esqueci minha senha
          </button>
        </div>
      </div>
    </div>
  );
}