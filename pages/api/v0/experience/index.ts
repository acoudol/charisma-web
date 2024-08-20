import { getExperienceLeaderboard, updateExperienceLeaderboard } from '@lib/db-providers/kv';
import { handleContractEvent } from '@lib/events/utils';
import { getNameFromAddress, getTokenBalance, getTotalSupply, hasPercentageBalance } from '@lib/stacks-api';
import { NextApiRequest, NextApiResponse } from 'next';
import numeral from 'numeral';
import { Webhook, EmbedBuilder } from '@tycrek/discord-hookr';

const hook = new Webhook('https://discord.com/api/webhooks/1144890336594907146/BtXYwXDuHsWt6IFMOylwowcmCUWjOoIM6MiqdIBqIdrbT5w_ui3xdxSP2OSc2DhlkDhn');

type ErrorResponse = {
    error: {
        code: string;
        message: string;
    };
};

export default async function getMetadata(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResponse>
) {

    let response, code = 200
    try {
        if (req.method === 'POST') {
            for (const a of req.body.apply) {
                for (const tx of a.transactions) {

                    const payload = {
                        ...tx.metadata.kind.data,
                        sender: tx.metadata.sender,
                        success: tx.metadata.success,
                    };

                    if (payload.success) {

                        const experienceAmount = await getTokenBalance('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.experience', payload.sender)
                        const experienceSupply = await getTotalSupply('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.experience')

                        // update leaderboard
                        await updateExperienceLeaderboard(experienceAmount, payload.sender)
                        // send message to discord
                        const builder = new EmbedBuilder()
                            .setTitle('Experience Gained')
                            .setDescription(`A player has gained experience`)
                            .setThumbnail({ url: 'https://charisma.rocks/experience.png' })
                            .addField({ name: 'Total Experience', value: Math.round(experienceAmount / Math.pow(10, 6)).toString() + ' EXP', inline: true })
                            .addField({ name: '% of Total Supply', value: numeral(experienceAmount / experienceSupply).format('0.0%'), inline: true })
                            .addField({ name: 'Wallet Address', value: payload.sender })


                        hook.addEmbed(builder.getEmbed());
                        await hook.send();

                        for (const event of tx.metadata.receipt.events) {
                            handleContractEvent(event);
                        }
                    }
                    response = {}
                }
            }
        } else if (req.method === 'GET') {
            response = await getExperienceLeaderboard(0, -1)
        } else {
            code = 501
            response = new Object({
                code: 'method_unknown',
                message: 'This endpoint only responds to GET'
            })
        }
    } catch (error: any) {
        console.error(error)
        response = {}
    }

    return res.status(code).json(response);
}