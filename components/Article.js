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
            <Grid container spacing={2} align="left" marginTop="25px">
                {props.posts.slice(0, props.maximum).map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <CardActionArea style={{ maxWidth: "370px" }}>
                            <Link href={"/posts/" + post.id}>
                                <a>
                                    <Image
                                        src={`/` + whichCategory(post.userId) +`.jpg`}
                                        alt="Placeholder Image"
                                        width={370}
                                        height={158}
                                    />
                                    <Text h3 color="#f293854" weight="bold">
                                        {post.title}
                                    </Text>
                                    <Text color="#4D20A3" weight="semibold">
                                        Content Creator |{" "}
                                        {whichCategory(post.userId)}
                                    </Text>
                                    <Text color="#A4B0C0" weight="medium">
                                        {post.body}
                                    </Text>
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
