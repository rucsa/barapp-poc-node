import Koa from "Koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import {
  getUserById,
  fetchAllUsers,
  refillUser,
  registerNewOrder,
  registerUser,
  userTicketPayment,
} from "./src/controller/user.controller.js";
import { fetchAllProducts, getProductById } from "./src/controller/product.controller.js";
import { fetchFullStorage, getStorageItemById } from "./src/controller/storage.controller.js";
import { sessionExists, getActiveSession, activateNewSession, updateActiveSession } from "./src/controller/session.controller.js";

import initDB from "./src/db/connect.js";

initDB();

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

app.use(cors());
app.use(bodyParser());

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
})

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
})

router.get("/storage/all", async (ctx) => {
  const items = await fetchFullStorage();
  ctx.status = 200;
  ctx.body = items;
});

router.get("/storage/get/item/:id", async (ctx) => {
  const item = await getStorageItemById(ctx.params.id);
  ctx.status = 200;
  ctx.body = item;
})

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

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => console.log("Listening on port 8080..."));
