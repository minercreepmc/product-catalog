/* eslint-disable */

export const protobufPackage = "";

export enum Services {
  USER_MANAGEMENT = 0,
  PRODUCT_CATALOG = 1,
  UNRECOGNIZED = -1,
}

export function servicesFromJSON(object: any): Services {
  switch (object) {
    case 0:
    case "USER_MANAGEMENT":
      return Services.USER_MANAGEMENT;
    case 1:
    case "PRODUCT_CATALOG":
      return Services.PRODUCT_CATALOG;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Services.UNRECOGNIZED;
  }
}

export function servicesToJSON(object: Services): string {
  switch (object) {
    case Services.USER_MANAGEMENT:
      return "USER_MANAGEMENT";
    case Services.PRODUCT_CATALOG:
      return "PRODUCT_CATALOG";
    case Services.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
