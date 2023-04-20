import styled from "styled-components";

export const Container = styled.div`
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
display: flex;
justify-content: center;
align-items: center;
background: rgba(0, 0, 0, .4);

.modal-content {
  width: 80%;
  max-width: 600px;
  height: 90vh;
  background: white;
  margin-top: -100px;
  opacity: 0;
  transition: all ease .3s;
  padding: 1em;
  overflow: auto;
  border-radius: 5px;

  &.active {
    margin-top: 0;
    opacity: 1;
  }
}

.list-images {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // grid-gap: 15px;
  
  li {
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border: 1px solid #CCC;
    padding: 50% 0;
  }

  span {
    display: inline-block;
    position: absolute;
    top: 3px;
    right: 3px;
    background: rgba(255, 0, 0, .5);
    color: white;
    padding: 0 5px;
    line-height: 1.1;
    cursor: pointer;

    &:hover {
      background: rgba(255, 0, 0, .8);
    }
  }
}

@media (min-width: 576px) { 

}
@media (min-width: 768px) { 

}
@media (min-width: 992px) { 
  .modal-content {
    
  }
}
@media (min-width: 1200px) { 

}
@media (min-width: 1400px) { 

}
`;