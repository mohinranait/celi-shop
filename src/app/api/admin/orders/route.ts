import mongoose from "mongoose";
import { NextResponse } from "next/server";

import Product from "@/models/product";
import connectDB from "@/lib/db";
import Order from "@/models/order";



/* -------------------------------------------------------------------------- */
/*                              CREATE ORDER API                              */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  await connectDB();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const body = await req.json();

    const {
      userId,
      items,
      shippingAddress,
      payment,
      coupon,
      customerNote,
      pricing
    } = body;

    /* ---------------------------------------------------------------------- */
    /*                               VALIDATION                               */
    /* ---------------------------------------------------------------------- */

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order items are required");
    }

    if (!shippingAddress) {
      throw new Error("Shipping address is required");
    }

    /* ---------------------------------------------------------------------- */
    /*                              PROCESS ORDER ITEMS                       */
    /* ---------------------------------------------------------------------- */

    const orderItems = [];
    let subtotal = 0;
    let totalQuantity = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId).session(session);

      if (!product) {
        throw new Error(`Product not found: ${cartItem.productName}`);
      }

      const { productType, quantity: requestedQty, variationId } = cartItem;

      /* --------------------------- STOCK CHECK & UPDATE --------------------------- */

      if (productType === "single") {
        // Single Product
        if ((product.stock || 0) < requestedQty) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock || 0}, Requested: ${requestedQty}`
          );
        }

        // Update stock
        await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: -requestedQty, totalSold: requestedQty } },
          { session }
        );
      } 
      else {
        // Variant Product
        if (!variationId) {
          throw new Error(`Variation ID is required for ${product.name}`);
        }

        const variation = product.variations.find(
          (v: { _id: mongoose.Types.ObjectId }) => v._id.toString() === variationId.toString()
        );

        if (!variation) {
          throw new Error(`Variation not found for ${product.name}`);
        }

        if ((variation.stock || 0) < requestedQty) {
          throw new Error(
            `Insufficient stock for ${product.name} (${variation.name || 'Variant'}). ` +
            `Available: ${variation.stock || 0}, Requested: ${requestedQty}`
          );
        }

        // Update Variant stock + Root product stock
        await Product.updateOne(
          { 
            _id: product._id, 
            "variations._id": variationId 
          },
          {
            $inc: {
              "variations.$.stock": -requestedQty,
              stock: -requestedQty,           // Root stock (sum of all variants)
              totalSold: requestedQty,
            },
          },
          { session }
        );
      }

      /* ------------------------------ PRICE CALCULATION ------------------------------- */

      const itemSubtotal = cartItem.salePrice * requestedQty;
      subtotal += itemSubtotal;
      totalQuantity += requestedQty;

      /* ---------------------------- PUSH ORDER ITEM ---------------------------- */

      orderItems.push({
        productId: product._id,
        productName: cartItem.productName,
        productImage: cartItem.productImage,
        productSlug: cartItem.productSlug,
        sku: cartItem.sku || "",
        quantity: requestedQty,
        price: cartItem.price,
        salePrice: cartItem.salePrice,
        subtotal: itemSubtotal,
        selectedVariants: cartItem.selectedVariants || {},
        categoryName: product?.category?.name || "",
        brandName: product?.brand?.name || "",
      });
    }

    /* ---------------------------------------------------------------------- */
    /*                                PRICING                                 */
    /* ---------------------------------------------------------------------- */

    const shippingCharge = pricing?.shippingCharge || 0;
    const couponDiscount = coupon?.discountAmount || 0;
    const total = subtotal - couponDiscount + shippingCharge;

    /* ---------------------------------------------------------------------- */
    /*                            INVOICE & TRACKING                          */
    /* ---------------------------------------------------------------------- */

    const invoiceNumber = `INV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const trackingNumber = `TR-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    /* ---------------------------------------------------------------------- */
    /*                              CREATE ORDER                              */
    /* ---------------------------------------------------------------------- */

    const orderPayload = {
      userId: userId || null,
      items: orderItems,
      totalItems: orderItems.length,
      totalQuantity,
      pricing: {
        subtotal,
        discount: couponDiscount,
        shippingCharge,
        tax: 0,
        total,
      },
      coupon: {
        code: coupon?.code || "",
        discountAmount: couponDiscount,
      },
      shippingAddress,
      payment,
      customerNote: customerNote || "",
      orderStatus: "PENDING",
      invoiceNumber,
      trackingNumber,
    };

    const order = await Order.create([orderPayload], { session });

    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: order[0],
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("An unknown error occurred");
    await session.abortTransaction();
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to create order",
      },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const isDelete = searchParams.get("isDelete");
    const date = searchParams.get("date");

    const skip = (page - 1) * limit;

    /* ----------------------------- FILTER QUERY ---------------------------- */

    const filter: any = {
      isDeleted: false,
    };

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.orderStatus = status;
    }


    // SOFT DELETE FILTER
    if (isDelete === "true") filter.isDeleted = true;
    if (isDelete === "false") filter.isDeleted = false;


    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    /* ------------------------------ DATABASE ------------------------------- */

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    /* ------------------------------ RESPONSE ------------------------------- */

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error: unknown) {
    const err= error instanceof Error ? error : new Error("An unknown error occurred");
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}