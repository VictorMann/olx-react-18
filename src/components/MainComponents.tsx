import styled from 'styled-components';

export const Template  = styled.div``;


export const PageTitle  = styled.h1`
font-size: 27px;
margin: .75em 0;
`;

export const PageBody  = styled.div``;

type PropsErroMessage = {
  children: JSX.Element | any;
};

export const ErrorMessage = ({ children }: PropsErroMessage) => {
  return (
    <div className="alert alert-danger" role="alert">
      {children}
    </div>
  )
};