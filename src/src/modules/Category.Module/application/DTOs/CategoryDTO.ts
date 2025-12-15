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