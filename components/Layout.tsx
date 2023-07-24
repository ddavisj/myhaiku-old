import React, { ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Device from "./Device";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Device>
      <Header />
      <Navigation />
      <div className="layout">{props.children}</div>
      <style jsx>{`
        .layout {
          padding: 0 2rem;
        }
      `}</style>
    </Device>
  </div>
);

export default Layout;
