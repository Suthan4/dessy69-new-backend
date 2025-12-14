export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | undefined,
    public image: string | undefined,
    public isActive: boolean,
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
}
