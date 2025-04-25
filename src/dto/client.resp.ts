// src/dto/client.resp.ts
import { Expose,Transform } from 'class-transformer';
import {IPersistence} from "../types/persistence.interface";

export class ClientResp implements IPersistence {

    @Expose() id!: number;

    @Expose({ name: 'full_name' })
    @Transform(({ value }) => value?.toString().toUpperCase())
    fullName!: string;

    @Transform(({ value }) => value?.toString().toUpperCase())
    @Expose() surname!: string;

    @Expose({ name: 'number_document' })
    numberDocument!: string;

    @Transform(({ value }) => value?.toString().toUpperCase())
    @Expose() email!: string;

    @Expose({ name: 'description_type_document' })
    @Transform(({ value }) => value?.toString().toUpperCase())
    descriptionTypeDocument!: string;

    @Expose({ name: 'description_genero' })
    @Transform(({ value }) => value?.toString().toUpperCase())
    descriptionGenero!: string;

    @Expose({ name: 'create_user' })
    createUser!: string;

    @Expose({ name: 'create_date' })
    createDate!: string;
}
