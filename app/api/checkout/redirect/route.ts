import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get("khoofiya_cart_token")?.value;

  const wcUrl = process.env.WORDPRESS_URL;

  if (!wcUrl) {
    return new NextResponse("WooCommerce URL not configured", { status: 500 });
  }

  if (!cartToken) {
    // If there is no cart token, redirect them back to the cart or archive
    return NextResponse.redirect(new URL("/cart", request.url));
  }

  // Redirect to the Native WooCommerce Checkout with the Cart-Token
  // We will need a PHP snippet on the Hostinger server to intercept this parameter
  const checkoutUrl = new URL(`${wcUrl}/checkout/`);
  checkoutUrl.searchParams.set("cart_token", cartToken);

  return NextResponse.redirect(checkoutUrl);
}
