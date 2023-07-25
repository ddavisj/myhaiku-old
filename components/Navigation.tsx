import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Navigation: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let right = null;
  let left = null;

  if (status === "loading") {
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/myposts">
          <a data-active={isActive("/myposts")}>My haiku</a>
        </Link>
        <Link href="/drafts">
          <a className="ml-4" data-active={isActive("/drafts")}>
            My drafts
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: gray;
          }

          // a + a {
          //   margin-left: 1rem;
          // }
        `}</style>
      </div>
    );
    right = (
      <div className="ml-auto">
        <Link href="/create">
          <button className="btn-blue">
            <div className="flex">
              <a>New</a>
            </div>
          </button>
        </Link>
      </div>
    );
  }

  const checkHideNav = () => {
    if (!left && !right) {
      return (
        <style>
          {`
            nav.menu {
               display: none !important;
            }
          `}
        </style>
      );
    }
  };

  return (
    <nav className="menu">
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          padding-top: 0.5rem;
          align-items: center;
        }
      `}</style>
      {checkHideNav()}
    </nav>
  );
};

export default Navigation;
