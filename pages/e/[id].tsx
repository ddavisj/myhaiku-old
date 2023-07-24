// Edit post - redone

import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
// import ReactMarkdown from "react-markdown";
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

// async function publishPost(id: string): Promise<void> {
//   await fetch(`/api/publish/${id}`, {
//     method: "PUT",
//   });
//   await Router.push("/");
// }

// async function unPublishPost(id: string): Promise<void> {
//   await fetch(`/api/unpublish/${id}`, {
//     method: "PUT",
//   });
//   await Router.push("/");
// }

// async function deletePost(id: string): Promise<void> {
//   await fetch(`/api/post/${id}`, {
//     method: "DELETE",
//   });
//   Router.push("/");
// }

const Post: React.FC<PostProps> = (props) => {
  let { title: oldTitle, content: oldContent, id } = props;

  const [title, setTitle] = useState(oldTitle);
  const [content, setContent] = useState(oldContent);

  useEffect(() => {
    const update_button = document.getElementById(
      "update_button"
    ) as HTMLButtonElement;

    // || content !== oldContent

    console.log("old title", oldTitle);
    console.log("title", title);

    update_button ? (update_button.disabled = true) : "";

    if (update_button) {
      console.log("Updated!");

      console.log("CHECK EQUIV:", title === oldTitle);

      if (title !== oldTitle || content !== oldContent) {
        update_button.disabled = false;
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

  // FIX!! Auth..
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let heading: string = `${oldTitle}`;

  // const changed: Boolean = !(title === oldTitle);

  // console.log("props", props);
  // console.log('changed', changed)

  // OLD METHOD..
  // let changed: Boolean;

  // const changesMade = () => {
  //
  // }
  // STATE IS BEING SET.. when title changes..
  // BUT HERE, I WANT THIS STATE CHANGE TO TRIGGER A RERENDER..
  //

  // const onTitleChange = (newTitle: string) => {
  //   console.log("newTitle", newTitle);
  //   setTitle(newTitle);
  //   console.log("prevTitle", title);
  //   console.log("Has changed from start?", !(oldTitle === newTitle));
  // };

  if (userHasValidSession && postBelongsToUser) {
    return (
      <Layout>
        <div>
          <form onSubmit={submitData}>
            <h2>Editing:</h2>
            <h3>{heading}</h3>
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
            />
            <textarea
              cols={50}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={8}
              value={content}
            />
            {/* <input disabled={!(content === oldContent) || !(title === oldTitle)} type="submit" value="Update" /> */}
            <input id="update_button" type="submit" value="Update" />
            {/* <a className="back" href="#" onClick={() => Router.push("/")}>
              or Cancel
            </a> */}
          </form>

          {/* <p>By {props?.author?.name || "Unknown author"}</p>
          <ReactMarkdown children={props.content} />
          {!props.published && userHasValidSession && postBelongsToUser && (
            <button onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {props.published && userHasValidSession && postBelongsToUser && (
            <button onClick={() => unPublishPost(props.id)}>Unpublish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button onClick={() => deletePost(props.id)}>Delete</button>
          )} */}
        </div>
        <style jsx>{`
          // .page {
          //   background: var(--geist-background);
          //   padding: 2rem;
          // }

          // .actions {
          //   margin-top: 2rem;
          // }

          // button {
          //   background: #ececec;
          //   border: 0;
          //   border-radius: 0.125rem;
          //   padding: 1rem 2rem;
          // }

          // button + button {
          //   margin-left: 1rem;
          // }
          .page {
            background: var(--geist-background);
            padding: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          input[type="text"],
          textarea {
            width: 100%;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border-radius: 0.25rem;
            border: 0.125rem solid rgba(0, 0, 0, 0.2);
          }

          input[type="submit"] {
            background: #ececec;
            border: 0;
            padding: 1rem 2rem;
          }

          .back {
            margin-left: 1rem;
          }
        `}</style>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div style={{ textAlign: "center" }}>
          Not allowed to edit this post!
        </div>
      </Layout>
    );
  }
};

export default Post;
