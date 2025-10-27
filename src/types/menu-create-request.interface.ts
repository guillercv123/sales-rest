export interface IMenuCreateRequest{
        type: string;
        keyName: string;
        displayName: string;
        route?: string;
        parentId: number;
        icon: string;
}