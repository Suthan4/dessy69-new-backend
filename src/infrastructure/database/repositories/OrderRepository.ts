import { Order, OrderStatus } from "@/domain/entities/Order.entity";
import { IOrderRepository } from "@/domain/interfaces/IOrderRepository";
import { IOrderDocument, OrderModel } from "../models/Order.model";
import { OrderMapper } from "../mappers/Order.mapper";

export class OrderRepository implements IOrderRepository {
  async findByOrderId(orderId: string): Promise<Order | null> {
    const doc = await OrderModel.findOne({ orderId });
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }

  async findByCustomerPhone(phone: string): Promise<Order[]> {
    const docs = await OrderModel.find({
      "customerDetails.phone": phone,
    }).sort({ createdAt: -1 });
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
    const doc = new OrderModel(OrderMapper.toPersistence(entity));
    await doc.save();
    return OrderMapper.mapToEntity(doc);
  }

  async findAll(): Promise<Order[]> {
    const docs = await OrderModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => OrderMapper.mapToEntity(doc));
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id);
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }

  async update(id: string, payload: Partial<Order>): Promise<Order | null> {
    const updateData = OrderMapper.toPersistence(payload as Order);
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return doc ? OrderMapper.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return !!result;
  }
}
