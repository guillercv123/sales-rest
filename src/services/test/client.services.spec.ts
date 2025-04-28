import {ClientService} from "../client.service";
import {ClientRepository} from "../../repositories/client.repository";
import {ConnectionMysql} from "../../db/mysql";
import {ClientResp} from "../../dto/client.resp";
import {IClientReq} from "../../types/client.interface";
jest.mock('../../repositories/client.repository');

describe('ClientService', ()=>{
    let clientService: ClientService;
    let clientRepository: jest.Mocked<ClientRepository>;

    beforeEach(() => {
        const connection: ConnectionMysql = new ConnectionMysql();
        clientRepository = new ClientRepository(connection) as jest.Mocked<ClientRepository>;
        clientService = new ClientService(clientRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('debe llamar findAll y retornar instancia de ClientResp', async () => {
        const dataMock = [{ id: 1, fullName: 'Cliente Prueba' }] as ClientResp[];
        clientRepository.findAll = jest.fn().mockResolvedValue(dataMock);

        const result = await clientService.findAll();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(item => {
            expect(item).toBeInstanceOf(ClientResp);
        });
    });

    it('debe llamar create y retornar instancia de ClientResp', async () => {
        // @ts-ignore
        const input: IClientReq = { fullName: 'Nuevo Cliente' } as ClientResp;
        const dataMock = { surname: 'Nuevo Cliente', fullName: 'Nuevo Cliente', email:'guillercv12@gmail.com', phone: '',
            idTypeDocument: 1, numberDocument: '', idGenero: 1, createUser: 'SYSTEM', createDate: '2020-02-12T12:00:00Z',} as IClientReq;

        // @ts-ignore
        clientRepository.create.mockResolvedValue(dataMock);

        const result = await clientService.create(input);

        expect(clientRepository.create).toHaveBeenCalledWith(input);
        expect(result).toBeInstanceOf(ClientResp);
        expect(result).toMatchObject(expect.any(Object));
    });
})