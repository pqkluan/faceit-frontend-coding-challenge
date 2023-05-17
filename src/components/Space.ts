import styled from 'styled-components';

const Space = styled.div<{ size?: number }>`
  height: ${({ size = 1 }) => size * 8}px;
`;

export default Space;
