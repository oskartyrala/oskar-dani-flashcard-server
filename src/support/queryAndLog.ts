import { Client, QueryResult } from "pg";

export default async function queryAndLog(
    qNum: number,
    client: Client,
    sql: string,
    params: string[] = []
): Promise<QueryResult> {
    console.log(
        `SQL START qNum: ${qNum
            .toString()
            .padStart(4, "0")} sql: ${sql} params: ${params}`
    );
    const response = await client.query(sql, params);
    return response;
}
