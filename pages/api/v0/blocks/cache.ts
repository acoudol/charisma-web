import { cacheGlobalState } from '@lib/db-providers/kv';
import { blocksApi } from '@lib/stacks-api';
import { setLatestBlock } from '@lib/user-api';
import { NextApiRequest, NextApiResponse } from 'next';

type ErrorResponse = {
    error: {
        code: string;
        message: string;
    };
};

export default async function cacheLatestBlock(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResponse>
) {

    const response: any = {}
    try {

        const { results } = await blocksApi.getBlocks({ limit: 1 })

        await cacheGlobalState(`blocks:latest`, results[0])

        response.block = results[0]

    } catch (error: any) {
        console.error(error.message);
    }

    return res.status(200).json(response);
}
