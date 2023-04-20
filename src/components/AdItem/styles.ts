import styled from "styled-components";

export const Container = styled.div`

.editable {
  position: relative;
  border-radius: inherit;
  overflow: hidden;
}
.editable-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(0, 0, 0, .3);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // visibility: hidden;
  opacity: 0;
  transition: opacity ease .3s;

  &:hover {
    // visibility: visible;
    opacity: 1;
  }

  & span, & a {
    display: inline-block;
    cursor: pointer;
    color: white;
    width: 50px;
    padding: calc(50% - 16px) 0;
    text-align: center;
    background: black;
    margin-left: .5em;
    border-radius: 50%;

    &:hover {
      color: var(	--bs-primary);
    }
  }
  
  a {
    text-decoration: none;
  }
}

figure {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 50% 0;

  img { display: none; }
}
`;