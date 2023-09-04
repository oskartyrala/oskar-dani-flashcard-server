import { performance } from "perf_hooks";
import { Client, QueryResult } from "pg";

export default async function queryAndLog(
    qNum: number,
    client: Client,
    sql: string,
    params: (string | number)[] = []
): Promise<QueryResult> {
    const paddedNum = qNum.toString().padStart(4, "0");
    console.log(`SQL START qNum: ${paddedNum} sql: ${sql} params:`, params);
    const startTime = performance.now();
    const response = await client.query(sql, params);
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime).toFixed(3);
    const paddedTime = elapsedTime.toString().padStart(10, " ");
    const paddedRowCount = response.rowCount.toString().padStart(5, " ");
    console.log(
        `SQL END   qNum: ${paddedNum} time: ${paddedTime}ms rowCount: ${paddedRowCount} sql: ${sql} params:`,
        params
    );
    return response;
}
