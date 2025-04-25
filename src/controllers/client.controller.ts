
import {createClient} from "../services/client.service";
import {MESSAGES} from "../constants/message";

export const insertClient = async (req:any, res:any)=>{
    const  clientReq  = req.body;
    try {
        const client = await createClient(clientReq);
        res.status(201).json({ message: MESSAGES.CLIENT_REGISTERED_SUCCESS, client});
    } catch (err) {
        res.status(500).json({ error: err });
    }
}