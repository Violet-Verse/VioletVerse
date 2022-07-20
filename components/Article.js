import Link from "next/link";
import Image from "next/image";
import { Grid, CardActionArea } from "@mui/material";
import { Text } from "@nextui-org/react";

const Article = (props) => {
    const whichCategory = (id) => {
        if (id == 1) {
            return "Tech";
        } else if (id == 2) {
            return "Lifestyle";
        } else {
            return "Education";
        }
    };
    return (
        <>
            <Grid
                container
                spacing={2}
                align="center"
                sx={{ marginTop: "25px" }}
                justifyContent="center"
            >
                {props.posts.slice(0, props.maximum).map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <CardActionArea sx={{ maxWidth: "370px" }}>
                            <Link href={"/posts/" + post.id}>
                                <a>
                                    <Image
                                        src={
                                            `/` +
                                            whichCategory(post.userId) +
                                            `.jpg`
                                        }
                                        alt="Placeholder Image"
                                        width={370}
                                        height={158}
                                        className="imageSm"
                                    />
                                    <h4 style={{ textAlign: "left" }}>
                                        {post.title}
                                    </h4>
                                    <h5
                                        style={{
                                            textAlign: "left",
                                            color: "#693E9A",
                                        }}
                                    >
                                        Content Creator |{" "}
                                        {whichCategory(post.userId)}
                                    </h5>
                                    <p
                                        style={{
                                            textAlign: "left",
                                            color: "#A4B0C0",
                                            // fontWeight: "400",
                                        }}
                                    >
                                        {post.body}
                                    </p>
                                </a>
                            </Link>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Article;
