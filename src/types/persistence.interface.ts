export interface IPersistence{
    createUser: string;
    createDate: string;
    updateUser?: string;
    updateDate?: string;
    deleteUser?: string;
    deleteDate?: string;
    active?: boolean;
}