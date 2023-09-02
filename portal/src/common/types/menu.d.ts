export interface MenuItem {
  applicationCode: string;
  menuCode: string;
  menuCreateBy: string;
  menuCreatetime: string;
  menuEnable: number;
  menuIconEnable: number;
  menuIconToken: string;
  menuId: number;
  menuIsdel: number;
  menuName: string;
  menuParentid: number;
  menuRemark: string;
  menuRoutingPath: string;
  menuSort: number;
  menuUpdateBy: string;
  menuUpdatetime: string; // key
  // path
  // title

}
export interface AntdMenuItem extends MenuItem {
  key: string;
  path: string;
  title: string;
  children?: MenuItem[];
}
export interface MenuTreeItem extends MenuItem {
  children?: MenuItem[];
}
export interface SystemMenu {
  code: string;
  company: string;
  id: string;
  menuTreelVOS: MenuTreeItem[];
  name: string;
  secret: string;
  version: string;
}