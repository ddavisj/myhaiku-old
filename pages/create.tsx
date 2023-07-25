import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            className="w-full p-2 my-2 rounded border-2 border-solid border-gray-300"
            autoFocus
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
          <div className="flex flex-wrap justify-between items-center">
            <input
              className="btn-regular"
              disabled={!content || !title}
              type="submit"
              value="Create"
            />
            <a
              className="btn-warning"
              href="#"
              onClick={() => Router.push("/")}
            >
              <div>Cancel</div>
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
