import styled from "styled-components";

export const Container = styled.div`

.container {
  flex-direction: column;
}
.logo {
  margin-bottom: .7em;
}
nav ul {
  margin: 0;
  flex-direction: column;

  li {
    margin-bottom: .7em;
  }
}

.logo {
  font-weight: bold;
  font-size: 1.5em;
}
.logo-1 { color: red   }
.logo-2 { color: green }
.logo-3 { color: blue  }

@media (min-width: 576px) { 
  .container {
    flex-direction: row;
  }

  .logo {
    margin-bottom: auto;
  }

  nav ul {
    flex-direction: row;
  
    li {
      padding-left: 1em;
      margin-bottom: 0;
    }
  }
}
@media (min-width: 768px) { 

}
@media (min-width: 992px) { 

}
@media (min-width: 1200px) { 

}
@media (min-width: 1400px) { 

}


`;
