import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";
import { OrderEntity } from "../../domain/entities/Order.entity";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository";
import { OrderModel } from "../models/Order.model";
import { OrderServiceMapper } from "../../application/mappers/OrderServiceMapper";

export class OrderRepository implements IOrderRepository {
  async create(order: OrderEntity): Promise<OrderEntity> {
    const doc = await OrderModel.create({
      userId: order.userId,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryCharge: order.deliveryCharge,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      phone: order.phone,
      deliveryAddress: order.deliveryAddress,
      couponCode: order.couponCode,
      notes: order.notes,
      statusHistory: order.statusHistory,
    });
    return OrderServiceMapper.fromPersistence(doc);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await OrderModel.findById(id).populate(
      "userId",
      "_id name email"
    );
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      OrderModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OrderModel.countDocuments({ userId }),
    ]);
    return { orders: docs.map((d) => this.toEntity(d)), total };
  }

  async findAll(
    page: number,
    limit: number,
    filters: any = {}
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.userId) query.userId = filters.userId;

    const [docs, total] = await Promise.all([
      OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email"),
      OrderModel.countDocuments(query),
    ]);
    return { orders: docs.map((d) => this.toEntity(d)), total };
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    note?: string
  ): Promise<OrderEntity | null> {
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date(), note } },
      },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    razorpayPaymentId?: string
  ): Promise<OrderEntity | null> {
    const updateData: any = { paymentStatus };
    if (razorpayPaymentId) updateData.razorpayPaymentId = razorpayPaymentId;

    const doc = await OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Partial<OrderEntity>
  ): Promise<OrderEntity | null> {
    const doc = await OrderModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: any): OrderEntity {
      const userId =
        doc.userId && doc.userId._id
          ? doc.userId._id.toString()
          : typeof doc.userId === "string"
          ? doc.userId
          : undefined;
    return new OrderEntity(
      doc._id.toString(),
      userId,
      doc.items,
      doc.subtotal,
      doc.discount,
      doc.deliveryCharge,
      doc.total,
      doc.status,
      doc.paymentStatus,
      doc.couponCode,
      doc.deliveryAddress,
      doc.phone,
      doc.notes,
      doc.razorpayOrderId,
      doc.razorpayPaymentId,
      doc.statusHistory,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
