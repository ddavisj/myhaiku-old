import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Header from "./Header";
import Navigation from "./Navigation";
import Device from "./Device";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  // const backgroundImage = (
  //   <Image src="/landing-page-flyer.jpg" alt="me" width="564" height="364" />
  // );

  const imageStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
  };

  interface imageStyle {
    borderRadius: string;
    border: string;
  }

  // function Style({ borderRadius, border }: imageStyle) {
  //   return (

  //   )
  // }

  return (
    <Device>
      <div className="layout-wrapper">
        <Image
          src="/images/myhaiku-bg.jpg"
          alt="Nature vibes"
          objectFit="cover"
          layout="fill"
          // style={{ borderRadius: "50%", border: "1px solid #fff" }}
          // width="350px"
          // height="300px"
          // quality="100"
        />
        <div className="layout-content">
          <Header />
          {session ? <Navigation /> : ""}
          <div className="py-0 px-8">{props.children}</div>
        </div>
      </div>
    </Device>
  );
};

export default Layout;
