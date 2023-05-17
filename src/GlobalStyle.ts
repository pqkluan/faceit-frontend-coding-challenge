import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  ${normalize};

  body {
    font-family: 'Play';
    background: ${theme.palette.background.body};
    color: ${theme.palette.text.primary};
    ${theme.typography.body};
    padding-left: ${theme.spacing(3)};
    padding-right:${theme.spacing(3)};
  }
`;

export default GlobalStyle;
