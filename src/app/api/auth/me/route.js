import jwt from "jsonwebtoken";

export function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ message: "No token" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    return Response.json({ user });
  } catch (err) {
    return Response.json({ message: "Invalid Token" }, { status: 401 });
  }
}
