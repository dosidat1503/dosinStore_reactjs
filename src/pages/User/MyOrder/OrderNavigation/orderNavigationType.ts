export interface ItemOfOrderStatusArray {
  key: string;
  value: OrderStatus;
}

interface OrderStatus {
  nameState: string;
  orderList: Array<Order>;
  pageQuantity: number;
  paginationList: Array<number>;
  openingPage: number;
  hasLoadFirtTime: number;
  hasChangeFromPreState: number;
  spaceGetDataFromOrderList: Array<SpaceGetDataFromOrder>;
}

interface Order {
  DANGSUDUNG: number;
  DIACHI: string;
  HINHTHUC_THANHTOAN: string;
  MADH: number;
  NGAYORDER: string;
  PHUONG_XA: string;
  QUAN_HUYEN: string;
  SDT: string;
  TEN: string;
  TINH_TP: string;
  TONGTIENDONHANG: number;
  TONGTIEN_SP: number;
  TRANGTHAI_THANHTOAN: string;
}

interface SpaceGetDataFromOrder {
  paginationNumber: number;
  ordinalNumber: number;
  startIndex: number;
  endIndex: number;
}

export interface OrderStatusObject {
  prepareing: OrderStatus;
  delivering: OrderStatus;
  delivered: OrderStatus;
  canceled: OrderStatus;
}
