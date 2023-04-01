import styled from "styled-components";

export const Container = styled.div`
font-size: .9em;

li {
  position: relative;

  &:not(:last-child)::after {
    content: '/';
    display: inline-block;
    padding: 0 .5em;
    color: #AAA;
  }
}
`;