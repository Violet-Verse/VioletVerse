import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { Grid, Button, ButtonGroup, CardActionArea } from "@mui/material";
import { Text } from "@nextui-org/react";

export const getStaticProps = async () => {
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/users/1/posts"
    );
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Posts = ({ posts }) => {
    return (
        <div>
            <Grid container spacing={2} align="left" marginTop="25px">
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <CardActionArea style={{ maxWidth: "370px" }}>
                            <Image
                                src="/Rectangle.png"
                                alt="Placeholder Image"
                                width={370}
                                height={158}
                            />
                            <Text h3 color="#f293854" weight="bold">
                                {post.title}
                            </Text>
                            <Text color="#4D20A3" weight="semibold">
                                Content Creator | Tech
                            </Text>
                            <Text color="#A4B0C0" weight="medium">
                                {post.body}
                            </Text>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Posts;
