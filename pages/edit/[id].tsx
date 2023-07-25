// Edit post

import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

console.log("here");

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (props) => {
  let { title: oldTitle, content: oldContent, id } = props;

  const [title, setTitle] = useState(oldTitle);
  const [content, setContent] = useState(oldContent);

  useEffect(() => {
    const update_button = document.getElementById(
      "update_button"
    ) as HTMLButtonElement;

    update_button ? (update_button.disabled = true) : "";

    if (update_button) {
      if (title !== oldTitle || content !== oldContent) {
        update_button.disabled = false;
        console.log("YOU CAN UPDATE!");
      } else {
        console.log("CANNOT UPDATE");
      }
    }
  }, [title, content]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch(`/api/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let heading: string = `${oldTitle}`;

  if (userHasValidSession && postBelongsToUser) {
    return (
      <Layout>
        <div>
          <form onSubmit={submitData}>
            <h2>Editing:</h2>
            <h3>{heading}</h3>
            <input
              autoFocus
              className="w-full p-2 my-2 rounded border-2 border-solid border-gray-300"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
            />
            <textarea
              className="w-full p-2 my-2 rounded border-2 border-solid border-gray-300"
              cols={50}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={8}
              value={content}
            />
            <div className="flex flex-wrap justify-between items-center mt-2">
              <input
                className="btn-regular"
                id="update_button"
                type="submit"
                value="Update"
              />
              <a
                className="btn-warning"
                href="#"
                onClick={() => Router.push("/")}
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className="text-center">Not allowed to edit this post!</div>
      </Layout>
    );
  }
};

export default Post;
