// src/components/Container.tsx
import { ReactNode } from 'react';
import styles from './style.module.css'; // Já vamos criar este arquivo!

// 1. Tipagem: O Container vai abraçar outros elementos (ReactNode)
type ContainerProps = {
  children: ReactNode;
};

// 2. Componente: Desestruturamos o children e aplicamos a estrutura base
export function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}