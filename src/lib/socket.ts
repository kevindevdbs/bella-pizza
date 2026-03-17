import { Server as HttpServer } from "http";
import { verify, JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { prisma } from "./prisma";

interface SocketAuthPayload extends JwtPayload {
  sub: string;
}

let io: Server | null = null;

function parseToken(socket: Socket): string | null {
  const authToken = socket.handshake.auth.token;
  const headerToken = socket.handshake.headers.authorization;

  const tokenSource =
    typeof authToken === "string"
      ? authToken
      : typeof headerToken === "string"
        ? headerToken
        : null;

  if (!tokenSource) {
    return null;
  }

  return tokenSource.startsWith("Bearer ") ? tokenSource.slice(7) : tokenSource;
}

export function initSocket(httpServer: HttpServer) {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  const ordersNamespace = io.of("/orders");

  ordersNamespace.use(async (socket, next) => {
    const token = parseToken(socket);

    if (!token) {
      next(new Error("Token não fornecido"));
      return;
    }

    try {
      const payload = verify(
        token,
        process.env.JWT_SECRET as string,
      ) as SocketAuthPayload;

      socket.data.userId = payload.sub;
      socket.data.role = undefined;
    } catch {
      next(new Error("Token inválido"));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: socket.data.userId as string },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      next(new Error("Usuário sem permissão"));
      return;
    }

    next();
  });

  ordersNamespace.on("connection", (socket) => {
    socket.emit("orders:connected", {
      connected: true,
      timestamp: new Date().toISOString(),
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function getOrdersNamespace() {
  return io?.of("/orders") ?? null;
}
