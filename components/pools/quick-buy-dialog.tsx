import React, { useState, useCallback } from 'react';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useOpenContractCall } from '@micro-stacks/react';
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { Pc, PostConditionMode } from "@stacks/transactions";
import { useAccount } from '@micro-stacks/react';
import numeral from 'numeral';
import { PoolInfo } from 'pages/pools';

type QuickBuyDialogProps = {
    pool: PoolInfo | null;
    onClose: () => void;
};

const QuickBuyDialog: React.FC<QuickBuyDialogProps> = ({ pool, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { openContractCall } = useOpenContractCall();
    const { stxAddress } = useAccount();

    const calculateExpectedChaAmount = (stxAmount: number, pool: PoolInfo) => {
        const stxReserve = pool.reserves.token0 / 10 ** pool.token0.decimals;
        const chaReserve = pool.reserves.token1 / 10 ** pool.token1.decimals;
        const k = stxReserve * chaReserve;
        const newStxReserve = stxReserve + stxAmount;
        const newChaReserve = k / newStxReserve;
        return chaReserve - newChaReserve;
    };

    const handleQuickBuy = useCallback(() => {
        if (!pool || !stxAddress) return;

        setIsLoading(true);

        const stxAmount = 10; // 10 STX
        const expectedChaAmount = calculateExpectedChaAmount(stxAmount, pool);
        const minChaAmount = BigInt(Math.floor(expectedChaAmount * 0.9 * 10 ** pool.token1.decimals)); // 1% slippage tolerance

        const postConditions = [
            Pc.principal(stxAddress)
                .willSendLte(BigInt(stxAmount * 10 ** pool.token0.decimals))
                .ustx() as any,
            Pc.principal('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.univ2-core')
                .willSendGte(minChaAmount)
                .ft(pool.token1.contractAddress as any, pool.token1.tokenId as string) as any,
        ];

        openContractCall({
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: "univ2-path2",
            functionName: "do-swap",
            functionArgs: [
                uintCV(BigInt(stxAmount * 10 ** pool.token0.decimals)),
                contractPrincipalCV(pool.token0.contractAddress.split('.')[0], pool.token0.contractAddress.split('.')[1]),
                contractPrincipalCV(pool.token1.contractAddress.split('.')[0], pool.token1.contractAddress.split('.')[1]),
                contractPrincipalCV("SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS", "univ2-share-fee-to"),
            ],
            postConditionMode: PostConditionMode.Deny,
            postConditions,
            onFinish: (data) => {
                console.log('Quick Buy transaction successful', data);
                setIsLoading(false);
                onClose();
            },
            onCancel: () => {
                console.log('Quick Buy transaction cancelled');
                setIsLoading(false);
            },
        });
    }, [pool, stxAddress, openContractCall, onClose]);

    if (!pool) return null;

    const expectedChaAmount = calculateExpectedChaAmount(10, pool);

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Quick Buy CHA</DialogTitle>
                <DialogDescription>
                    Buy CHA with 10 STX from the {pool.token0.symbol}/{pool.token1.symbol} pool.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <p>You will spend: 10 STX</p>
                <p>Estimated CHA to receive: {numeral(expectedChaAmount).format('0,0.0000')} CHA</p>
                <p className="text-sm text-gray-500">
                    (Price impact and fees are included in the estimate)
                </p>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleQuickBuy} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Confirm Quick Buy'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default QuickBuyDialog;