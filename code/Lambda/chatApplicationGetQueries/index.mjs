import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import {
    DynamoDBDocumentClient,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "chatapplication-userquery";

export const handler = async (event,context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch (event.routeKey) {
            case "GET /api/queries":
                const { Items } = await dynamo.send(new ScanCommand({
                    TableName: tableName
                }));
                body = JSON.stringify(Items);
                break;
            case "GET /api/getquery/ping":
                body = JSON.stringify({
                    response: "pong"
                });
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body,
        headers
    };
}