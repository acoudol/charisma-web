import { TxBroadcastResult } from "@stacks/transactions";
import { getTxsFromMempool, callContractPublicFunction } from "./stacks-api";


export async function tryResetEpochs(contractJobs: any[]) {

    // Fetch mempool transactions concurrently
    const [mpt1] = await Promise.all([
        getTxsFromMempool('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.wanted-hogger-v1'),
    ]);

    console.log(mpt1)

    // filter for only real mempool transactions and not stale ones
    const mempoolTxs = [mpt1].filter((tx: any) => tx.receipt_time > (Date.now() / 1000) - 5000);

    // Filter out jobs in mempool
    const newJobs = contractJobs.filter((job: any) =>
        !mempoolTxs.find((tx: any) =>
            tx.contract_call.contract_id === job.address &&
            tx.contract_call.function_name === job.function
        )
    );

    // Run all jobs concurrently
    const jobPromises = newJobs.map((job: { function: string | PromiseLike<string>; address: any; args: any; }, index: number) =>
        new Promise((resolve) => {
            setTimeout(() => {
                // console.log(`Running job: ${job.function}`);
                const strategy: any = {
                    address: job.address,
                    functionName: job.function,
                    fee: 10000,
                    args: job.args
                };
                callContractPublicFunction(strategy)
                    .then(() => resolve(strategy))
                    .catch((error) => {
                        console.error(`Error executing job ${job.function}:`, error);
                        resolve(strategy);
                    });
            }, index * 3000); // Stagger job execution by 3 seconds to get new nonce
        })
    );

    const jobs = (await Promise.all(jobPromises)) as TxBroadcastResult[];
    return jobs.map((job) => job.txid);
}