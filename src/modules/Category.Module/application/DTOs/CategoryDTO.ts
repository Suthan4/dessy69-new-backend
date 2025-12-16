import { CategoryMetadata } from "@/modules/Category.Module/domain/entities/Category.entity";

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parentId?: string;
  order?: number;
  metadata?: CategoryMetadata;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  metadata?: CategoryMetadata;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId: string | null;
  level: number;
  path: string;
  pathIds: string[];
  order: number;
  metadata: CategoryMetadata;
  children?: CategoryResponseDTO[];
  breadcrumbs?: CategoryBreadcrumb[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
  level: number;
}
