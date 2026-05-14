<<<<<<< HEAD
# Atualizando o título da aba por página (document.title)

## Objetivo

Melhorar a experiência de navegação da aplicação configurando o título da aba do navegador de forma dinâmica em cada página principal.

## Como esta prática foi definida

Sem transcrição nesta etapa: a prática foi inferida diretamente dos arquivos modificados da branch, que mostram a adição de `useEffect` com `document.title` nas páginas:

- `Home`
- `History`
- `Settings`
- `AboutPomodoro`
- `NotFound`

## O que foi implementado

Em cada página, foi adicionado:

1. `import { useEffect } from 'react';`
2. `useEffect(() => { document.title = '...'; }, []);`

Com isso, sempre que a página é aberta, o título da aba é atualizado para refletir o conteúdo atual da rota.

## Benefícios

- Melhora usabilidade (o usuário sabe em qual seção está só pela aba).
- Ajuda em organização quando há várias abas abertas.
- Prepara terreno para melhorias de SEO e acessibilidade sem dependências extras.

## Resultado esperado

- Home: título da aba exibe `Chronos Pomodoro`.
- Histórico: título da aba exibe `Histórico - Chronos Pomodoro`.
- Configurações: título da aba exibe `Configurações - Chronos Pomodoro`.
- Sobre: título da aba exibe `Entenda a Técnica Pomodoro - Chronos Pomodoro`.
- 404: título da aba exibe `Página não encontrada - Chronos Pomodoro`.

---

## Código-fonte dos arquivos modificados nesta branch

### `src/pages/Home/index.tsx`

```tsx
import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
```

### `src/pages/History/index.tsx`

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { showMessage } from '../../adapters/showMessage';

export function History() {
  const { state, dispatch } = useTaskContext();
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const hasTasks = state.tasks.length > 0;

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: 'startDate',
        direction: 'desc',
      };
    },
  );

  useEffect(() => {
    setSortTaskOptions(prevState => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  }, []);

  useEffect(() => {
    if (!confirmClearHistory) return;

    setConfirmClearHistory(false);

    dispatch({ type: TaskActionTypes.RESET_STATE });
  }, [confirmClearHistory, dispatch]);

  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';

    setSortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza?', confirmation => {
      setConfirmClearHistory(confirmation);
    });
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortTasks({ field: 'name' })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'duration' })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'startDate' })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {sortTasksOptions.tasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
```

### `src/pages/Settings/index.tsx`

```tsx
import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import { useTaskContext } from '../../contexts/TaskContext';
import { useEffect, useRef } from 'react';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function Settings() {
  const { state, dispatch } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Configurações - Chronos Pomodoro';
  }, []);

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    const formErrors = [];

    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      formErrors.push('Digite apenas números para TODOS os campos');
    }

    if (workTime < 1 || workTime > 99) {
      formErrors.push('Digite valores entre 1 e 99 para foco');
    }

    if (shortBreakTime < 1 || shortBreakTime > 30) {
      formErrors.push('Digite valores entre 1 e 30 para descanso curto');
    }

    if (longBreakTime < 1 || longBreakTime > 60) {
      formErrors.push('Digite valores entre 1 e 60 para descanso longo');
    }

    if (formErrors.length > 0) {
      formErrors.forEach(error => {
        showMessage.error(error);
      });
      return;
    }

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });
    showMessage.success('Configurações salvas');
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>Configurações</Heading>
      </Container>

      <Container>
        <p style={{ textAlign: 'center' }}>
          Modifique as configurações para tempo de foco, descanso curso e
          descanso longo.
        </p>
      </Container>

      <Container>
        <form onSubmit={handleSaveSettings} action='' className='form'>
          <div className='formRow'>
            <DefaultInput
              id='workTime'
              labelText='Foco'
              ref={workTimeInput}
              defaultValue={state.config.workTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='shortBreakTime'
              labelText='Descanso curto'
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput
              id='longBreakTime'
              labelText='Descanso longo'
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultButton
              icon={<SaveIcon />}
              aria-label='Salvar configurações'
              title='Salvar configurações'
            />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
}
```

### `src/pages/AboutPomodoro/index.tsx`

```tsx
import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { RouterLink } from '../../components/RouterLink';
import { MainTemplate } from '../../templates/MainTemplate';

export function AboutPomodoro() {
  useEffect(() => {
    document.title = 'Entenda a Técnica Pomodoro - Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>A Técnica Pomodoro 🍅</Heading>
          {/* ...restante do conteúdo permanece igual... */}
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

### `src/pages/NotFound/index.tsx`

```tsx
import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { RouterLink } from '../../components/RouterLink';
import { MainTemplate } from '../../templates/MainTemplate';

export function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada - Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>404 - Página não encontrada 🚀</Heading>
          {/* ...restante do conteúdo permanece igual... */}
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

---

## Checklist

- [ ] Cada página principal define seu próprio `document.title`.
- [ ] `useEffect` usa dependências vazias (`[]`) para rodar no carregamento da página.
- [ ] Os títulos seguem um padrão consistente com `Chronos Pomodoro`.
- [ ] Navegar entre rotas atualiza corretamente o texto da aba.
=======
# 🎓 Construção de Frontend
Repositório destinado às aulas teóricas e às atividades práticas da disciplina.

## 🛠️ Ambiente de Desenvolvimento
Para acompanhar a disciplina, você precisará das seguintes ferramentas:
| Ferramenta | O que é? | Recomendação |
| :--- | :--- | :--- |
| **Editor de código** | Ambiente onde você escreverá seu código (HTML, CSS, JS, JSX). | [Visual Studio Code](https://code.visualstudio.com/) | 
| **Ambiente de Execução** | Necessário para rodar o servidor de desenvolvimento e gerenciar pacotes (npm). | [Node.js (versão LTS)](https://nodejs.org/pt-br/) |
| **Versionador** | Controla e registra o histórico de alterações do código. | [Git](https://git-scm.com/) |

## 📂 Estrutura de Pastas
Este repositório está organizado da seguinte forma:
- **`aulas/`**: Contém os códigos e exemplos utilizados nas aulas teóricas.
- **`praticas/`**: Contém os códigos das atividades práticas desenvolvidas pelos alunos.

## 🚀 Fluxo de Trabalho Acadêmico
As atividades seguem o fluxo de trabalho baseado no modelo [GitFlow](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow).

### 1. Configuração Inicial (realizar apenas uma vez)
Execute estes passos para preparar seu ambiente:
1. **Criar Repositório**: Clique no botão `Use this template`, no topo da página, para criar uma cópia deste repositório na sua conta GitHub.
2. **Clonar Repositório**: Faça o clone do seu repositorio para a sua máquina local:
```bash
git clone https://github.com/SEU_USUARIO/template-for-frontend-class.git
```
3. **Configurar Identificação**: Certifique-se que seu **nome** e **email** estejam configurados no Git:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
``` 

### 2. Entrega de Atividades (repetir para cada prática)
Para cada nova atividade, siga o fluxo abaixo:
1. **Crie uma Issue**: Acesse a aba `Issues` no GitHub e clique no botão `New issue` para criar a prática usando o template correspondente.
2. **Crie uma branch**: Acesse a branch `develop` e crie uma nova branch.
3. **Desenvolva e teste**: Implemente os arquivos na pasta da prática e realize os testes.
4. **Envie para o GitHub**: Salve suas alterações e envie para o seu repositório.
5. **Solicite a revisão**: Acesse o seu repositório no GitHub e crie um `Pull Request` direcionando para a sua branch `develop`. 

> ⚠️ **Atenção!**<br>
> Se o check ✅ não aparecer no `Pull Request`, há erros de compilação ou sintaxe que precisam ser corrigidos.

### 3. **Instale as dependências e rode o projeto:** Ao acessar a pasta de um projeto React, instale os pacotes necessários e inicie o servidor local:
```bash
npm install
npm run dev   # ou npm start, dependendo de como o projeto foi criado
```

### 4. **Desenvolva e teste:** Implemente os arquivos solicitados na pasta da prática e verifique no navegador se tudo está funcionando corretamente.

### 5. **Envie para o GitHub:** Salve suas alterações, crie os commits e envie para o seu repositório:
```bash
git add .
git commit -m "Feat: Finaliza a implementação da Prática XX"
git push origin feature/praticaXX
```

### 6. Feedback e Avaliação
Envie o link do seu `Pull Request` pela plataforma de ensino da instituição. A avaliação do código será feita usando o sistema de **Code Review**:
- **Approve (Aprovado):** Seu código cumpre os requisitos solicitados.
- **Request Changes (Solicitação de Ajustes):** Foram encontrados pontos de melhoria, bugs ou erros de sintaxe. Você deve corrigir na sua máquina, fazer um novo commit+push na mesma branch e avisar no comentário do PR para uma nova revisão.

>>>>>>> 1b88bc95c6174d8d1214f977f4eaddd19619fe95
