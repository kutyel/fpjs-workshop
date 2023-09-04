import React, { Fragment } from 'react'
import styled from '@emotion/styled'
import { Split as S, SplitRight as SR } from 'mdx-deck/layouts'

const Wrapper = styled.main`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: center;
  position: relative;
  width: 100vw;

  & > div[class*='Split'] {
    height: 90vh;
  }

  & h1 {
    padding-top: 2rem;
  }

  & > div > div:first-child {
    height: 90vh !important;
  }
`

const Footer = styled.footer`
  border-top: 1px solid #dc5f53;
  color: white;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  padding: 30px 100px;
  text-align: right;
  width: 100vw;
`

const Layout = ({ children }) => (
  <Fragment>
    <Wrapper>{children}</Wrapper>
    <Footer>
      <span>React Alicante {new Date().getFullYear()} ⚛️</span>
      <span>@FlavioCorpa</span>
    </Footer>
  </Fragment>
)

export const Split = ({ children, ...props }) => (
  <Layout>
    <S {...props}>{children}</S>
  </Layout>
)

export const SplitRight = ({ children, ...props }) => (
  <Layout>
    <SR {...props}>{children}</SR>
  </Layout>
)

export default Layout
