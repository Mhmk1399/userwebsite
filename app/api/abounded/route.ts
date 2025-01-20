    import { NextResponse,NextRequest } from "next/server";
    import connect from "@/lib/data";
    import { getStoreId } from "@/middleWare/storeId";
    import Abounded from "@/models/abounded";
    export async function GET(req: NextRequest) {
      await connect();
      if (!connect) {
        return NextResponse.json({ error: "Connection failed!" });
      }
      const storeId = getStoreId();
      try {
        const abounded = await Abounded.find()
        return NextResponse.json(abounded, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to fetch abounded" },
          { status: 500 }
        );
      }
    }
    export async function POST(req: NextRequest) {
        await connect();
        if (!connect) {
          return NextResponse.json({ error: "Connection failed!" });
        }
        
        const storeId = getStoreId();
        
        try {
          const body = await req.json();
          
          // Validate required fields
          if (!body.userId || !body.products || !Array.isArray(body.products)) {
            return NextResponse.json(
              { error: "Missing required fields" },
              { status: 400 }
            );
          }
      
          // Calculate total amount from products
          const totalAmount = body.products.reduce((sum: number, product: any) => {
            return sum + (product.price * product.quantity);
          }, 0);
      
          const abandonedCart = await Abounded.create({
            userId: body.userId,
            storeId,
            products: body.products.map((product: any) => ({
              productId: product.productId,
              quantity: product.quantity,
              price: product.price
            })),
            totalAmount
          });
      
          return NextResponse.json(abandonedCart, { status: 201 });
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to create abandoned cart" },
            { status: 500 }
          );
        }
      }
      

