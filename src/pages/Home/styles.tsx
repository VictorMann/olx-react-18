import styled from "styled-components";

export const Container = styled.div`

.area-busca {
  background-color: #e1e1e1;
  border-bottom: 3px solid #DDD;
}
form {
  background: #b5cf25;
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
