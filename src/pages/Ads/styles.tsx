import styled from "styled-components";

export const Container = styled.div`

form {
  font-size: .9em;
  
  input, select {
    border-color: rgb(181, 207, 37);
  }

  .cat-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    padding: .5em .2em;
    border: 1px dotted transparent;
    transition: all .2s ease;

    &:hover {
      border-color: rgb(181, 207, 37);
    }
    &.selected {
      background-color: rgb(181, 207, 37);
    }
  }
  .fig {
    display: inline-block;
    width: 2em;
    height: 2em;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: .5em;
  }
}

.ad-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;

  figure { min-height: 116.5px; overflow: hidden }

  @media (min-width: 576px) { 
    figure { min-height: 117.75px; max-height: 117.75px; }
  }
  @media (min-width: 768px) { 
    figure { min-height: 152.75px; max-height: 152.75px; }
  }
  @media (min-width: 992px) { 
    figure { min-height: 212.75px; max-height: 212.75px; }
  }
  @media (min-width: 1200px) { 
    figure { min-height: 275.75px; max-height: 275.75px; }
  }
  @media (min-width: 1400px) { 
    figure { min-height: 302.75px; max-height: 302.75px; }
  }
}
`;

type FakeProps = {
  height?: number;
};

export const Fake = styled.div<FakeProps>`
background-color: #DDD;
// padding: ${props => props.height ?? 10}px 0;
height: ${props => props.height ?? 10}px;
`;
