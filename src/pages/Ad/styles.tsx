import styled from "styled-components";

export const Container = styled.div`

.area-item,
.area-item > *:first-child {
  flex-direction: column;
}
.my-breadcrumb {
  font-size: .7em;
  & > div {
    display: none;
  }
}
.slide-container {
  width: 100%;
  max-width: 400px;
}
.detail-date,
.detail-desc,
.detail-views {
  display: block;
}
.detail-date {
  color: #AAA;
  font-size: .9em;
  margin-bottom: 1em;
}
.detail-desc {
  border-bottom: 1px solid #CCC;
  padding: .5em 0;
  font-size: .95em;
}
.detail-views {
  color: #AAA;
  font-size: .8em;
  padding-top: .3em;
}

.ad-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}

@media (min-width: 576px) { 
  .my-breadcrumb {
    font-size: .9em;
    & > div {
      display: inline-block;
    }
  }
}
@media (min-width: 768px) { 
  .area-item {
    flex-direction: row;
  }
  .area-item > *:first-child {
    flex: 6;
    margin-right: 1.5em;
  }
  .area-item > *:last-child {
    flex: 3;
  }
  .ad-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 992px) { 
  .area-item figure .fake,
  .slide-container {
    width: 400px;
  }
  .area-item > *:first-child {
    flex-direction: row;
    flex: 6;
    margin-right: 1.5em;
  }
  .area-item > *:last-child {
    flex: 2;
  }
  .area-item > *:first-child > div {
    margin-top: 3rem;
  } 
}
@media (min-width: 1200px) { 

}
@media (min-width: 1400px) { 

}
`;