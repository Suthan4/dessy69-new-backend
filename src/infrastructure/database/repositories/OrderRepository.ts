import { Order, OrderItem, OrderStatus } from "@/domain/entities/Order.entity";
import { IOrderRepository } from "@/domain/interfaces/IOrderRepository";
import { IOrderDocument, OrderModel } from "../models/Order.model";
import { ProductVariant } from "@/domain/entities/Product.entity";
import { Types } from "mongoose";
import { OrderMapper } from "../mappers/Order.mapper";

export class OrderRepository implements IOrderRepository {
  async findByUserId(userId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ userId }).sort({ createAt: -1 });
    return docs.map((doc) => OrderMapper.mapToEntity(doc));
  }
  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const docs = await OrderModel.find({ status }).sort({ createdAt: -1 });
    return docs.map((doc) => OrderMapper.mapToEntity(doc));
  }
  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true }
    );
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }
  async getTodayIOrders(): Promise<Order[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const docs = await OrderModel.find({
      createdAt: { $gte: startOfDay },
    }).sort({ createdAt: -1 });
    return docs.map((doc) => OrderMapper.mapToEntity(doc));
  }
  async getIOrderStatistics(startDate: Date, endDate: Date): Promise<any> {
    return await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);
  }
  async create(entity: Order): Promise<Order> {
    const docs = await OrderModel.create(OrderMapper.toPresistance(entity));
    return OrderMapper.mapToEntity(docs);
  }
  async findAll(): Promise<Order[]> {
    const docs = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone");
    return docs.map((doc) => OrderMapper.mapToEntity(doc));
  }
  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id).populate(
      "userId",
      "name email phone"
    );
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }
  async update(id: string, payload: Partial<Order>): Promise<Order | null> {
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      { payload, updatedAt: new Date() },
      { new: true }
    );
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return !!result;
  }
}
