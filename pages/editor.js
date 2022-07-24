import React from "react";
import Editor from "../Components/Editor";

const EditorPage = () => {
    const initialValue =
        "<h1>Into the Violet Verse</h1><p>Start writing your post here.</p>";
    const [value, setValue] = React.useState(initialValue);

    return <Editor value={value} onChange={setValue} />;
};

export default EditorPage;
