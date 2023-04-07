import styled from "styled-components";

export const Container = styled.div`

.area-item > *:first-child {
  flex: 6;
}
.area-item > *:last-child {
  flex: 2;
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
padding: ${props => props.height ?? 10}px 0;
`;
