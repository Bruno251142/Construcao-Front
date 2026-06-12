import { useState } from 'react';
import { useNavigate } from 'react-router';

import styles from '../Login/styles.module.css';

export function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState('');

  const [token, setToken] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [message, setMessage] =
    useState('');

  async function handleGenerateToken() {
    try {
      const response = await fetch(
        'http://localhost:3333/auth/forgot-password',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(data.error);

        return;
      }

      setToken(data.token);

      setMessage(
        'Token gerado com sucesso',
      );
    } catch {
      setMessage(
        'Erro ao conectar servidor',
      );
    }
  }

  async function handleResetPassword() {
    try {
      const response = await fetch(
        'http://localhost:3333/auth/reset-password',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(data.error);

        return;
      }

      setMessage(
        'Senha alterada com sucesso',
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch {
      setMessage(
        'Erro ao conectar servidor',
      );
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Recuperar senha</h1>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>

            <input
              type='email'
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              placeholder='Digite seu email'
            />
          </div>

          <button
            className={styles.loginButton}
            onClick={handleGenerateToken}
          >
            Gerar token
          </button>

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
  Voltar
</p>

          {token && (
            <>
              <div
                className={
                  styles.inputGroup
                }
              >
                <label>Token</label>

                <input
                  type='text'
                  value={token}
                  onChange={event =>
                    setToken(
                      event.target.value,
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.inputGroup
                }
              >
                <label>Nova senha</label>

                <input
                  type='password'
                  value={password}
                  onChange={event =>
                    setPassword(
                      event.target.value,
                    )
                  }
                />
              </div>

              <button
                className={
                  styles.loginButton
                }
                onClick={
                  handleResetPassword
                }
              >
                Redefinir senha
              </button>
            </>
          )}

          {message && (
            <p className={styles.message}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}