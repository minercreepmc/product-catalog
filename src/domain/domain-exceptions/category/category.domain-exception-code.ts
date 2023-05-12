export enum CategoryDomainExceptionCodes {
  DoesNotExist = 'CATEGORY.DOES_NOT_EXIST',
  ParentIdDoesNotExist = 'CATEGORY.PARENT_ID_DOES_NOT_EXIST',
  SubCategoryIdDoesNotExist = 'CATEGORY.SUB_CATEGORY_ID_DOES_NOT_EXIST',
  AlreadyExist = 'CATEGORY.ALREADY_EXIST',
  IdDoesNotValid = 'CATEGORY.ID_DOES_NOT_VALID',
  NameDoesNotValid = 'CATEGORY.NAME_DOES_NOT_VALID',
  ParentIdDoesNotValid = 'CATEGORY.PARENT_ID_DOES_NOT_VALID',
  SubCategoryIdsDoesNotValid = 'CATEGORY.SUB_CATEGORY_IDS_DOES_NOT_VALID',
  DescriptionDoesNotValid = 'CATEGORY.DESCRIPTION_DOES_NOT_VALID',
  ParentIdAndSubCategoryIdOverlap = 'CATEGORY.PARENT_ID_AND_SUB_CATEGORY_ID_OVERLAP',
}
