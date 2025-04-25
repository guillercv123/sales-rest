
import {createClient, getClients} from "../services/client.service";
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

export const listClient = async (req:any, res:any) => {
    try {
        const clients = await getClients();
        res.status(200).json({resp: clients})
    }catch (err){
        res.status(500).json({error:err})
    }
}