export interface IResource{
    id:string;
    type: string;
    keyName: string;
    displayName: string;
    route?: string;
    parentId: number;
    icon: string;
}