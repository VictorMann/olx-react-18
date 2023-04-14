import styled from "styled-components";

export const Container = styled.div`

form {
  padding: 1em;

  & > div {
    flex-direction: column;
  }
  label {
    margin-right: 1em;
  }
}
.area-remember-pass {
  flex-direction: row;
}

@media (min-width: 576px) { 
  form {
    & > div {
      flex-direction: row;

      label {
        width: 30%;
        text-align: right;

        & + div {
          flex: 1;
        }
      }
    }
  }
}
@media (min-width: 768px) { 
  form {
    & > div {
      
      label {
        width: 140px;

        & + div {
          flex: none;
          width: 350px;
        }
      }
    }
  }
}
@media (min-width: 992px) { 

}
@media (min-width: 1200px) { 

}
@media (min-width: 1400px) { 

}
`;
