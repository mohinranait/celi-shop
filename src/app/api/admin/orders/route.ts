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
    /*                              ORDER ITEMS                               */
    /* ---------------------------------------------------------------------- */

    const orderItems = [];

    let subtotal = 0;
    let totalQuantity = 0;

    for (const cartItem of items) {
      const product = await Product.findById(
        cartItem.productId
      ).session(session);

      if (!product) {
        throw new Error("Product not found");
      }


      const productType = cartItem?.productType;



      /* ------------------------------ PRICE ------------------------------- */


      const itemSubtotal = cartItem.salePrice * cartItem.quantity;

      subtotal += itemSubtotal;

      totalQuantity += cartItem.quantity;

      /* ---------------------------- ORDER ITEM ---------------------------- */

      orderItems.push({
        productId: product._id,

        productName: cartItem.productName,

        productImage: cartItem.productImage,

        productSlug: cartItem.productSlug,

        sku: cartItem.sku || "",

        quantity: cartItem.quantity,

        price: cartItem.price,

        salePrice: cartItem.salePrice,

        subtotal: itemSubtotal,

        selectedVariants:
          cartItem.selectedVariants || {},

        categoryName:
          product?.category?.name || "",

        brandName:
          product?.brand?.name || "",
      });

      /* --------------------------- STOCK UPDATE --------------------------- */


      // update product quantity
      if (productType === "single") {
        if (product.stock < cartItem.quantity) {
          throw new Error(
            `${product.name} stock not available`
          );
        }

        product.stock -= cartItem.quantity;
      } else {
        const findVariation =
          product.variations.find(
            (variant: any) =>
              variant._id.toString() ===
              cartItem.variationId
          );

        if (!findVariation) {
          throw new Error(
            `Variation not found`
          );
        }

        if (
          findVariation.stock <
          cartItem.quantity
        ) {
          throw new Error(
            `Variation stock not available`
          );
        }

        // decrement variation stock
        findVariation.stock -=
          cartItem.quantity;

        // recalculate total stock
        product.stock =
          product.variations.reduce(
            (total: number, variation: { stock: number }) =>
              total + variation.stock,
            0
          );
      }

      // await product.save({ session });

      if (productType === "single") {
        if (product.stock < cartItem.quantity) {
          throw new Error(`${product.name} stock not available`);
        }

        await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: -cartItem.quantity } },
          { session, runValidators: false }
        );

      } else {
        // variant product
        const findVariation = product.variations.find(
          (variant: any) => variant._id.toString() === cartItem.variationId
        );

        if (!findVariation) {
          throw new Error(`Variation not found`);
        }

        if (findVariation.stock < cartItem.quantity) {
          throw new Error(`Variation stock not available`);
        }

        await Product.updateOne(
          { _id: product._id, "variations._id": cartItem.variationId },
          {
            $inc: {
              "variations.$.stock": -cartItem.quantity,
              stock: -cartItem.quantity,
            },
          },
          { session, runValidators: false }
        );
      }
    }

    /* ---------------------------------------------------------------------- */
    /*                                PRICING                                 */
    /* ---------------------------------------------------------------------- */

    const shippingCharge = pricing?.shippingCharge || 0;

    let couponDiscount = 0;

    if (coupon?.discountAmount) {
      couponDiscount = coupon.discountAmount;
    }

    const total = subtotal - couponDiscount + shippingCharge;


    /* ---------------------------------------------------------------------- */
    /*                            INVOICE NUMBER                              */
    /* ---------------------------------------------------------------------- */
    const number1 = Math.random().toString(36).slice(2, 7).toUpperCase();
    const number2 = Math.random().toString(36).slice(2, 9).toUpperCase();
    const invoiceNumber = `INV-${number1}`;
    const trackingNumber = `tr-${number2}`

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
        discountAmount:
          couponDiscount,
      },

      shippingAddress,

      payment: {
        method:
          payment?.method || "COD",
        status: "PENDING",
      },

      customerNote: customerNote || "",

      orderStatus: "PENDING",

      invoiceNumber,
      trackingNumber,
    };

    const order = await Order.create(
      [
        orderPayload
      ],
      { session }
    );


    /* ---------------------------------------------------------------------- */
    /*                               COMMIT DB                                */
    /* ---------------------------------------------------------------------- */

    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message:
          "Order created successfully",
        data: order[0],
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    await session.abortTransaction();

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create order",
      },
      {
        status: 400,
      }
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
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}