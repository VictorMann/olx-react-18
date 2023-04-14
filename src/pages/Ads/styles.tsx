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
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}

@media (min-width: 576px) { 
  .row > *:first-child {
    padding-right: 0;
    width: 33%;
  }
  .row > *:last-child {
    width: 67%;
  }
}
@media (min-width: 768px) { 
  .row > *:first-child {
    padding-right: calc(var(--bs-gutter-x) * .5);
    width: 25%;
  }
  .row > *:last-child {
    width: 75%;
  }
  .ad-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 992px) { 
  .ad-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1200px) { 

}
@media (min-width: 1400px) { 

}
`;
