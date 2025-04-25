// src/dto/client.resp.ts
import { Expose } from 'class-transformer';
import {IPersistence} from "../types/persistence.interface";

export class ClientResp implements IPersistence {

    @Expose() id!: number;

    @Expose({ name: 'full_name' })
    fullName!: string;

    @Expose() surname!: string;

    @Expose() email!: string;

    @Expose({ name: 'description_type_document' })
    descriptionTypeDocument!: string;

    @Expose({ name: 'description_genero' })
    descriptionGenero!: string;

    @Expose({ name: 'create_user' })
    createUser!: string;

    @Expose({ name: 'create_date' })
    createDate!: string;
}
