import Koa from "Koa";
import cors from "@koa/cors";
import json from "koa-json";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import Path from "path";
import { config } from "dotenv";
import Router from "koa-router";
import {
  getUserById,
  fetchAllUsers,
  refillUser,
  registerNewOrder,
  registerUser,
  userTicketPayment,
} from "./src/controller/user.controller.js";
import {
  fetchAllProducts,
  getProductById,
} from "./src/controller/product.controller.js";
import {
  fetchFullStorage,
  getStorageItemById,
} from "./src/controller/storage.controller.js";
import {
  sessionExists,
  getActiveSession,
  activateNewSession,
  updateActiveSession,
} from "./src/controller/session.controller.js";
import {
  login,
  register,
  registerSimple,
  findUserByUsername,
} from "./src/controller/auth.controller.js";
import initDB from "./src/db/connect.js";

initDB();

config({ path: Path.resolve(".env") });

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});

app.use(json());
app.use(bodyParser());
app.use(cors());
// auth middleware
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
  }).unless({
    path: ["/auth/login"],
  })
);

router.post("/register", async (ctx) => {
  if (ctx.$user.accessLevel === "ADMIN") {
    const registerUser = await register(
      ctx.request.body.newUser,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = { userId: registerUser };
  } else {
    ctx.status = 401;
  }
}),
  router.post("/register-simple", async (ctx) => {
    console.log(ctx.$user);
    if (
      ctx.$user.accessLevel === "ADMIN" ||
      ctx.$user.accessLevel === "STAFF"
    ) {
      const registerUser = await registerSimple(
        ctx.request.body.newUser,
        ctx.$user.username
      );
      ctx.status = 200;
      ctx.body = { userId: registerUser };
    } else {
      ctx.status = 401;
    }
  }),
  router.post("/auth/login", async (ctx) => {
    const userLoging = await login(
      ctx.request.body.username,
      ctx.request.body.password
    );
    ctx.status = 200;
    ctx.body = userLoging;
  }),
  router.get("/auth/user", async (ctx) => {
    try {
      const user = ctx.$user;
      delete user.password;
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }),
  router.get("/session/status", async (ctx) => {
    const session = await sessionExists();
    ctx.status = 200;
    ctx.body = { status: session };
  });

router.get("/session/get-active", async (ctx) => {
  const session = await getActiveSession();
  ctx.status = 200;
  ctx.body = { session: session };
});

router.post("/session/new", async (ctx) => {
  const session = await activateNewSession(ctx.request.body.sessionData);
  ctx.status = 200;
  ctx.body = session;
});

router.post("/session/update", async (ctx) => {
  const session = await updateActiveSession(ctx.request.body.sessionData);
  ctx.status = 200;
  ctx.body = session;
});

router.get("/users", async (ctx) => {
  const users = await fetchAllUsers();
  ctx.status = 200;
  ctx.body = users;
});

router.get("/products", async (ctx) => {
  const products = await fetchAllProducts();
  ctx.status = 200;
  ctx.body = products;
});

router.get("/product/get/:id", async (ctx) => {
  const item = await getProductById(ctx.params.id);
  ctx.status = 200;
  ctx.body = item;
});

router.get("/storage/all", async (ctx) => {
  const items = await fetchFullStorage();
  ctx.status = 200;
  ctx.body = items;
});

router.get("/storage/get/item/:id", async (ctx) => {
  const item = await getStorageItemById(ctx.params.id);
  ctx.status = 200;
  ctx.body = item;
});

router.post("/new-user", async (ctx) => {
  const newUserRegistration = await registerUser(ctx.request.body.newUserData);
  ctx.status = 200;
  ctx.body = newUserRegistration;
});

router.get("/profile/:id", async (ctx) => {
  const user = await getUserById(ctx.params.id);
  ctx.status = 200;
  ctx.body = user;
});

router.get("/user/:id/pay-ticket", async (ctx) => {
  const newClovers = await userTicketPayment(ctx.params.id);
  ctx.status = 200;
  ctx.body = { availableClovers: newClovers };
});

router.post("/user/:id/refill", async (ctx) => {
  const newClovers = await refillUser(
    ctx.params.id,
    ctx.request.body.newClovers
  );
  ctx.status = 200;
  ctx.body = { availableClovers: newClovers };
});

router.post("/user/:id/new-order", async (ctx) => {
  const newClovers = await registerNewOrder(
    ctx.params.id,
    ctx.request.body.grandTotal
  );
  ctx.status = 200;
  ctx.body = { availableClovers: newClovers };
});

try {
  // initialize the auth service
  // await auth.init();

  // inject $user based on the auth token
  app.use(async (ctx, next) => {
    const jwtUser = ctx.state?.user?.data;
    // if a jwt token is present then fetch the user of that token
    if (jwtUser != null && jwtUser.username) {
      try {
        ctx.$user = await findUserByUsername(jwtUser.username);
        if (ctx.$user == null) {
          throw new Error();
        }
      } catch (ex) {
        console.log(ex);
        ctx.status = 401;
        return;
      }
    }
    await next();
  });

  // Configure routes
  //app.use(configureRouter().routes());

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(8080, () => console.log("Listening on port 8080..."));
} catch (ex) {
  console.log("Startup error:", "error");
  console.log(ex);
}
