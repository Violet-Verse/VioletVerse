import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ddbClient = new DynamoDBClient({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
