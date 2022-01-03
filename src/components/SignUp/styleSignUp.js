import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
export const LoginHeadButton = styled(Link)`
  color: #fff;
  background-color: #528ff0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 700;
  width: 72px;
  margin-left: 12px;
  outline: 0 !important;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.428571429;
  vertical-align: middle;
  background-image: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
export const LoginMainAuthBody = styled.div`
  padding: 0;
  height: 600px;
  width: 322px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 4px 4px 8px 0 rgb(23 31 37 / 6%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 4px 4px 8px 0 rgb(23 31 37 / 6%);
  top: -30px;
  left: 30px;
  -webkit-transition: left 0.8s cubic-bezier(0.175, 0.885, 0.26, 1.055);
  transition: left 0.8s cubic-bezier(0.175, 0.885, 0.26, 1.055);
  @media (min-width: 890px) {
    right: 480px;
    position: absolute;
  }
  @media (max-width: 890px) {
    margin: 0 auto;
  }
`;
export const LoginInnerBodyMessage = styled.div`
  opacity: 1;
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
  left: 390px;
  right: 40px;
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  position: absolute;
  top: 40px;
  bottom: 40px;
`;