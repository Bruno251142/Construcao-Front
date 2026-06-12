import { useEffect } from 'react';

import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';

import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  useEffect(() => {
    document.title =
      'Chronos Pomodoro';
  }, []);

  const user = JSON.parse(
    sessionStorage.getItem('user') ||
      '{}',
  );

  return (
    <MainTemplate>
      <p
        style={{
          textAlign: 'center',
          color: '#ffffff',
          marginTop: '10px',
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: '600',
          opacity: '0.9',
        }}
      >
        Bem-vindo, {user.name}
      </p>

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}