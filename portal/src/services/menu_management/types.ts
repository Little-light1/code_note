type Enable = 0 | 1;
export interface CreateMenuDTO {
  applicationCode: string;
  menuCode: string;
  menuEnable: Enable;
  menuLargePic: string;
  menuNameCn: string;
  menuNameEn: string;
  menuParentid: number;
  menuPicEnable: Enable;
  menuRemark: string;
  menuRoutingPath: string;
  menuSmallPic: string;
  menuSort: number;
  menuType: string;
}