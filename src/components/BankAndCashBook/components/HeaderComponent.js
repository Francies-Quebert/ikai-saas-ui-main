import React from "react";
import styled from "styled-components";

const HeaderComponent = (props) => {
  return (
    <Card>
      <Container>
        <h3>{props.data.PayDesc}</h3>
        <h6>{props.data.PayCode}</h6>
        <h6>{props.data.ClosingBalance}</h6>
      </Container>
    </Card>
  );
};

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 8px 0px 8px 8px;
  height: 100%;
  border-radius: 5px;
  background-color: var(--app-theme-color-secondary);
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

const Container = styled.div`
  padding: 8px 8px;
  display: flex;
`;

export default HeaderComponent;
