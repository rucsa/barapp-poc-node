import Koa from "koa";
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
} from "./controller/user.controller.js";
import {
  fetchAllProducts,
  getProductById,
} from "./controller/product.controller.js";
import {
  fetchFullStorage,
  getStorageItemById,
  updateStorageItem
} from "./controller/storage.controller.js";
import {
  sessionExists,
  getActiveSession,
  activateNewSession,
  updateActiveSession,
} from "./controller/session.controller.js";
import {
  login,
  register,
  registerSimple,
  findUserByUsername,
} from "./controller/auth.controller.js";
import initDB from "./db/connect.js";

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
  try {
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
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
}),
  router.post("/register-simple", async (ctx) => {
    try {
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
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  }),
  router.post("/auth/login", async (ctx) => {
    try {
      const userLoging = await login(
        ctx.request.body.username,
        ctx.request.body.password
      );
      ctx.status = 200;
      ctx.body = userLoging;
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  }),
  router.get("/auth/user", async (ctx) => {
    try {
      const user = ctx.$user;
      delete user.password;
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  }),
  router.get("/session/status", async (ctx) => {
    try {
      const session = await sessionExists();
      ctx.status = 200;
      ctx.body = { status: session };
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  });

router.get("/session/get-active", async (ctx) => {
  try {
    const session = await getActiveSession();
    ctx.status = 200;
    ctx.body = { session: session };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/session/new", async (ctx) => {
  try {
    const session = await activateNewSession(ctx.request.body.sessionData);
    ctx.status = 200;
    ctx.body = session;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/session/update", async (ctx) => {
  try {
    const session = await updateActiveSession(ctx.request.body.sessionData);
    ctx.status = 200;
    ctx.body = session;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/users", async (ctx) => {
  try {
    const users = await fetchAllUsers();
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/products", async (ctx) => {
  try {
    const products = await fetchAllProducts();
    ctx.status = 200;
    ctx.body = products;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/product/get/:id", async (ctx) => {
  try {
    const item = await getProductById(ctx.params.id);
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/storage/all", async (ctx) => {
  try {
    const items = await fetchFullStorage();
    ctx.status = 200;
    ctx.body = items;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/storage/get/item/:id", async (ctx) => {
  try {
    const item = await getStorageItemById(ctx.params.id);
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/storage/update-item", async (ctx) => {
  console.log(ctx.request.body.storageItem)
  try {
    const item = await updateStorageItem(ctx.request.body.storageItem);
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/new-user", async (ctx) => {
  try {
    const newUserRegistration = await registerUser(
      ctx.request.body.newUserData
    );
    ctx.status = 200;
    ctx.body = newUserRegistration;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/profile/:id", async (ctx) => {
  try {
    const user = await getUserById(ctx.params.id);
    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/user/:id/pay-ticket", async (ctx) => {
  try {
    const newClovers = await userTicketPayment(ctx.params.id);
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/:id/refill", async (ctx) => {
  try {
    const newClovers = await refillUser(
      ctx.params.id,
      ctx.request.body.newClovers
    );
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/:id/new-order", async (ctx) => {
  try {
    const newClovers = await registerNewOrder(
      ctx.params.id,
      ctx.request.body.grandTotal
    );
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

try {
  app.use(async (ctx, next) => {
    const jwtUser = ctx.state?.user?.data;
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
