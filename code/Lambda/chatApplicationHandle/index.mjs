import faker from "faker";

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch (event.routeKey) {
            case "GET /api/random":
                body = JSON.stringify({
                    response: faker.lorem.sentence()
                });
                break;
            case "GET /api/handle/ping":
                body = JSON.stringify({
                    response: "pong"
                });
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    }
    catch (err) {
        statusCode = 400;
        body = err.message;
    }
    finally {
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