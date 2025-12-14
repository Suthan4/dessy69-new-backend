// export interface CreateCategoryDTO {
//   name: string;
//   description?: string;
//   image?: string;
//   isActive?: boolean;
//   parentId?: string | null;
// }

// export interface UpdateCategoryDTO {
//   name?: string;
//   description?: string;
//   image?: string;
//   isActive?: boolean;
//   parentId?: string | null;
// }

// export interface CategoryResponseDTO {
//   id: string;
//   name: string;
//   description?: string;
//   image?: string;
//   isActive: boolean;
//   path: string;
//   parentId: string | null;
//   level: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface CategoryTreeDTO extends CategoryResponseDTO {
//   children: CategoryTreeDTO[];
//   productCount?: number;
// }

// export interface CategoryBreadcrumbDTO {
//   id: string;
//   name: string;
//   level: number;
// }
export interface CreateCategoryDTO {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parentId?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId: string | null;
  level: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBreadcrumbDTO {
  id: string;
  name: string;
  level: number;
}