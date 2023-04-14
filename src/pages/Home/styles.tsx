import styled from "styled-components";

export const Container = styled.div`

.area-busca {
  background-color: #e1e1e1;
  border-bottom: 3px solid #DDD;
}
form {
  background: #b5cf25;
}

.area-busca--1 > *:not(:last-child) {
  margin-bottom: .7em;
}
.list-categories {
  flex-wrap: wrap;

  & > * {
    width: 50%;
    text-align: center;
    padding: 1em;
    border: 1px solid #bbb;
  }

  img { 
    display: none;
    width: 60px;
    margin-right: .5em;
  }
}

.ad-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}


@media (min-width: 576px) { 
  .ad-list {
    grid-template-columns: repeat(3, 1fr);
  }
  .list-categories {
    & > * {
      border: none;
      text-align: left;
      padding: .5em;
    }
    img {
      display: inline-block;
    }
  }
}
@media (min-width: 768px) { 
  .ad-list {
    grid-template-columns: repeat(4, 1fr);
  }
  .area-busca--1 {
    margin: 0;
  }
  .area-busca--1 > * {
    width: 25%;
  }
  .area-busca--1 > *:not(:last-child) {
    margin-bottom: 0;
  }
  .area-busca--1 > *:first-child {
    width: 50%;
  }
  .list-categories {
    justify-content: space-evenly;
    & > * {
      width: auto;
    }
  }
}
@media (min-width: 992px) { 

}
@media (min-width: 1200px) { 
  .area-busca--1 > * {
    width: 18%;
  }
  .area-busca--1 > *:first-child {
    width: 64%;
  }
}
@media (min-width: 1400px) { 
  .area-busca--1 > * {
    width: 15%;
  }
  .area-busca--1 > *:first-child {
    width: 70%;
  }
}


`;
