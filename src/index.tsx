import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import GlobalStyle from './GlobalStyle';
import store from './store';
import Container from './components/Container';
import H4 from './components/H4';
import Space from './components/Space';
import { TournamentsContainer } from './components/TournamentsContainer';
import { TournamentSearchInput } from './components/TournamentSearchInput';
import { CreateTournamentButton } from './components/CreateTournamentButton';

const App: FC = () => {
  return (
    <Container>
      <H4>{'FACEIT Tournaments'}</H4>

      <Row>
        <TournamentSearchInput />
        <CreateTournamentButton />
      </Row>

      <Space size={2} />

      <TournamentsContainer />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;

const container = document.getElementById('root');
if (!container) throw new Error('No container found');

const root = createRoot(container);

root.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>
);
