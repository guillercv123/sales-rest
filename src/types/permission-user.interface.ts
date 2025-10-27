export interface IPermissionUser {
    menu: IMenu[];
    button: IButton[];
}

export interface IMenu {
    menuId: number;
    menuKey: string;
    menuName: string | null;      // display_name puede ser null
    menuParentId: number | null;  // parent_id puede ser null en menús raíz
    icon: string | null;
}

export interface IButton {
    buttonId: number;
    buttonKey: string;
    buttonName: string | null;    // display_name puede ser null
    viewId: number | null;        // si no hubo vista ancestro encontrada
    viewKey: string | null;
    viewName: string | null;
    menuId: number | null;        // si no hubo menú top-level encontrado
    menuKey: string | null;
    menuName: string | null;
}
