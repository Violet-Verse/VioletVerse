import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const credentials = {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

export const ddbClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: credentials,
});
