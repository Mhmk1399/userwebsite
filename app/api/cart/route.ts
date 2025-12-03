import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Cart from "@/models/cart";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

// GET - Get cart by ID or all carts with filters
export async function GET(request: NextRequest) {
  try {
    await connect();

    const userId = request.headers.get("userId");
    const storeId = process.env.STORE_ID;
    console.log(storeId, "sadads");

    // If userId is provided in headers, get specific cart
    if (userId) {
      const query: Record<string, unknown> = { userId };

      // Add storeId filter if provided
      if (storeId) {
        query.storeId = storeId;
      }

      const cart = await Cart.findOne(query).populate("items.productId");

      if (!cart) {
        return NextResponse.json(
          { success: false, message: "Cart not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: cart });
    }

    // Get all carts with filters from query params
    const searchParams = request.nextUrl.searchParams;
    const query: Record<string, unknown> = {};

    // Filter by storeId
    if (searchParams.get("storeId")) {
      query.storeId = searchParams.get("storeId");
    }

    // Filter by userId
    if (searchParams.get("userId")) {
      query.userId = searchParams.get("userId");
    }

    // Filter by product ID in items
    if (searchParams.get("productId")) {
      query["items.productId"] = searchParams.get("productId");
    }

    // Filter by color code
    if (searchParams.get("colorCode")) {
      query["items.colorCode"] = searchParams.get("colorCode");
    }

    // Filter by product name (partial match)
    if (searchParams.get("productName")) {
      query["items.name"] = {
        $regex: searchParams.get("productName"),
        $options: "i",
      };
    }

    // Filter by minimum quantity
    if (searchParams.get("minQuantity")) {
      query["items.quantity"] = {
        $gte: parseInt(searchParams.get("minQuantity") || "0"),
      };
    }

    // Filter by maximum quantity
    if (searchParams.get("maxQuantity")) {
      query["items.quantity"] = {
        ...((query["items.quantity"] as Record<string, unknown>) || {}),
        $lte: parseInt(searchParams.get("maxQuantity") || "999"),
      };
    }

    // Filter by minimum price
    if (searchParams.get("minPrice")) {
      query["items.price"] = {
        $gte: parseFloat(searchParams.get("minPrice") || "0"),
      };
    }

    // Filter by maximum price
    if (searchParams.get("maxPrice")) {
      query["items.price"] = {
        ...((query["items.price"] as Record<string, unknown>) || {}),
        $lte: parseFloat(searchParams.get("maxPrice") || "999999"),
      };
    }

    // Filter by property name
    if (searchParams.get("propertyName")) {
      query["items.properties.name"] = searchParams.get("propertyName");
    }

    // Filter by property value
    if (searchParams.get("propertyValue")) {
      query["items.properties.value"] = searchParams.get("propertyValue");
    }

    // Filter by created date range
    if (searchParams.get("createdFrom")) {
      query.createdAt = {
        $gte: new Date(searchParams.get("createdFrom") || ""),
      };
    }

    if (searchParams.get("createdTo")) {
      query.createdAt = {
        ...((query.createdAt as Record<string, unknown>) || {}),
        $lte: new Date(searchParams.get("createdTo") || ""),
      };
    }

    // Filter by updated date range
    if (searchParams.get("updatedFrom")) {
      query.updatedAt = {
        $gte: new Date(searchParams.get("updatedFrom") || ""),
      };
    }

    if (searchParams.get("updatedTo")) {
      query.updatedAt = {
        ...((query.updatedAt as Record<string, unknown>) || {}),
        $lte: new Date(searchParams.get("updatedTo") || ""),
      };
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const [carts, total] = await Promise.all([
      Cart.find(query)
        .populate("items.productId")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Cart.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: carts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching carts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch carts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create or update cart
export async function POST(request: NextRequest) {
  try {
    await connect();

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as CustomJwtPayload;
      userId = decoded.userId;
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    const storeId = process.env.STORE_ID;
    const body = await request.json();
    const { items } = body;

    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "storeId is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "items array is required" },
        { status: 400 }
      );
    }

    // If items array is empty, delete the cart instead
    if (items.length === 0) {
      const deletedCart = await Cart.findOneAndDelete({ userId, storeId });
      return NextResponse.json({
        success: true,
        message: "Cart cleared (empty items array)",
        data: deletedCart,
      });
    }

    // Validate items structure
    for (const item of items) {
      if (
        !item.productId ||
        !item.name ||
        !item.price ||
        !item.quantity ||
        !item.image
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid item structure. Required: productId, name, price, quantity, image",
          },
          { status: 400 }
        );
      }
    }

    // Check if cart exists for this user and store
    let cart = await Cart.findOne({ userId, storeId });

    if (cart) {
      // Update existing cart
      cart.items = items;
      await cart.save();
    } else {
      // Create new cart
      cart = await Cart.create({
        userId,
        storeId,
        items,
      });
    }

    return NextResponse.json({
      success: true,
      message: cart ? "Cart updated successfully" : "Cart created successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error creating/updating cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create/update cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update cart items (add/remove/update quantity)
export async function PATCH(request: NextRequest) {
  try {
    await connect();

    // Get userId from headers
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required in headers" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, item } = body;
    const storeId = process.env.STORE_ID;

    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "storeId is required" },
        { status: 400 }
      );
    }

    if (!action || !["add", "remove", "update", "clear"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid action required: add, remove, update, clear",
        },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId, storeId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    switch (action) {
      case "add":
        if (!item || !item.productId) {
          return NextResponse.json(
            {
              success: false,
              message: "Item with productId required for add action",
            },
            { status: 400 }
          );
        }
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(
          (i: {
            productId: { toString: () => string };
            colorCode: string;
            properties: Array<{ name: string; value: string }>;
          }) =>
            i.productId.toString() === item.productId &&
            i.colorCode === (item.colorCode || "") &&
            JSON.stringify(i.properties || []) ===
              JSON.stringify(item.properties || [])
        );

        if (existingItemIndex > -1) {
          // Update quantity
          cart.items[existingItemIndex].quantity += item.quantity || 1;
        } else {
          // Add new item
          cart.items.push(item);
        }
        break;

      case "remove":
        if (!item || !item.productId) {
          return NextResponse.json(
            {
              success: false,
              message: "Item with productId required for remove action",
            },
            { status: 400 }
          );
        }
        cart.items = cart.items.filter(
          (i: {
            productId: { toString: () => string };
            colorCode: string;
            properties: Array<{ name: string; value: string }>;
          }) =>
            !(
              i.productId.toString() === item.productId &&
              i.colorCode === (item.colorCode || "") &&
              JSON.stringify(i.properties || []) ===
                JSON.stringify(item.properties || [])
            )
        );
        break;

      case "update":
        if (!item || !item.productId || !item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Item with productId and quantity required for update action",
            },
            { status: 400 }
          );
        }
        const updateIndex = cart.items.findIndex(
          (i: {
            productId: { toString: () => string };
            colorCode: string;
            properties: Array<{ name: string; value: string }>;
          }) =>
            i.productId.toString() === item.productId &&
            i.colorCode === (item.colorCode || "") &&
            JSON.stringify(i.properties || []) ===
              JSON.stringify(item.properties || [])
        );

        if (updateIndex > -1) {
          cart.items[updateIndex].quantity = item.quantity;
          if (item.quantity <= 0) {
            cart.items.splice(updateIndex, 1);
          }
        }
        break;

      case "clear":
        cart.items = [];
        break;
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete cart
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    // Get userId from headers
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required in headers" },
        { status: 400 }
      );
    }

    const storeId = process.env.STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "storeId required in headers" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndDelete({ userId, storeId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart deleted successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
