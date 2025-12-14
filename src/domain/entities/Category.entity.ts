// export class Category {
//   constructor(
//     public readonly id: string,
//     public name: string,
//     public description: string | undefined,
//     public image: string | undefined,
//     public isActive: boolean,
//     public path: string, // NEW: Materialized path (e.g., "/1/2/3/")
//     public parentId: string | null, // NEW: Direct parent reference
//     public level: number, // NEW: Depth level (0 = root, 1 = subcategory, etc.)
//     public createdAt: Date,
//     public updatedAt: Date
//   ) {}

//   isRoot(): boolean {
//     return this.parentId === null && this.level === 0;
//   }

//   isDescendantOf(ancestorPath: string): boolean {
//     return this.path.startsWith(ancestorPath) && this.path !== ancestorPath;
//   }

//   getAncestorIds(): string[] {
//     if (this.isRoot()) return [];
//     return this.path.split("/").filter((id) => id !== "" && id !== this.id);
//   }

//   buildChildPath(childId: string): string {
//     return `${this.path}${childId}/`;
//   }

//   activate(): void {
//     this.isActive = true;
//     this.updatedAt = new Date();
//   }

//   deactivate(): void {
//     this.isActive = false;
//     this.updatedAt = new Date();
//   }

//   updateParent(newParentId: string | null, newParentPath: string | null): void {
//     this.parentId = newParentId;
//     if (newParentId === null) {
//       this.path = `/${this.id}/`;
//       this.level = 0;
//     } else {
//       this.path = `${newParentPath}${this.id}/`;
//       this.level = newParentPath!.split("/").filter((p) => p !== "").length;
//     }
//     this.updatedAt = new Date();
//   }
// }
export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | undefined,
    public image: string | undefined,
    public isActive: boolean,
    public parentId: string | null,
    public level: number,
    public path: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  isRoot(): boolean {
    return this.parentId === null && this.level === 0;
  }

  isChild(): boolean {
    return this.parentId !== null && this.level > 0;
  }
}