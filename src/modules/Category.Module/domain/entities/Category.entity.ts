export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly path: string, // Materialized Path: "/fruits/" or "/fruits/tropical/"
    public readonly description?: string,
    public readonly parentId?: string,
    public readonly level: number = 0,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public getAncestorIds(): string[] {
    if (!this.path || this.path === "/") return [];
    return this.path.split("/").filter((id) => id !== "");
  }

  public isRootCategory(): boolean {
    return this.level === 0;
  }

  public static create(
    name: string,
    slug: string,
    parentPath: string = "",
    parentId?: string
  ): CategoryEntity {
    const level = parentPath
      ? parentPath.split("/").filter((p) => p).length
      : 0;
    const path = parentPath ? `${parentPath}${slug}/` : `/${slug}/`;

    return new CategoryEntity(
      "",
      name.trim(),
      slug.toLowerCase(),
      path,
      undefined,
      parentId,
      level
    );
  }
}
