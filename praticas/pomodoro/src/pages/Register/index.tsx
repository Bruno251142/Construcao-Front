import { useState } from 'react';
import { useNavigate } from 'react-router';

import styles from '../Login/styles.module.css';

export function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [message, setMessage] =
    useState('');

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name && !email && !password) {
      setMessage(
        'Preencha todos os campos',
      );

      return;
    }

    if (!name) {
      setMessage('Preencha o nome');

      return;
    }

    if (!email) {
      setMessage('Preencha o email');

      return;
    }

    if (!password) {
      setMessage('Preencha a senha');

      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3333/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
  const errorData =
    await response.json();

  setMessage(
    errorData.error ||
      'Erro ao criar conta',
  );

  return;
}

      setMessage(
        'Conta criada com sucesso!',
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch {
      setMessage(
        'Erro ao conectar com servidor',
      );
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Chronos Pomodoro</h1>

        <h2>Cadastro</h2>

        <form
          onSubmit={handleRegister}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <label>Nome</label>

            <input
              type='text'
              value={name}
              onChange={event =>
                setName(
                  event.target.value,
                )
              }
              placeholder='Digite seu nome'
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>

            <input
              type='email'
              value={email}
              onChange={event =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder='Digite seu email'
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>

            <input
              type='password'
              value={password}
              onChange={event =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder='Digite sua senha'
            />
          </div>

          <button
            type='submit'
            className={styles.loginButton}
          >
            Criar conta
          </button>
        </form>

        <p
  onClick={() => navigate('/')}
  style={{
    marginTop: '12px',
    cursor: 'pointer',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    opacity: '0.8',
  }}
>
  Já tenho conta
</p>

        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}