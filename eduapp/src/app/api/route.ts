import {NextApiRequest, NextApiResponse} from "next";

export const GET= async(res: NextApiResponse) => {
    return new Response(
        "Hellow World"
    )
}