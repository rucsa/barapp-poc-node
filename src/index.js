import Koa from "koa";
import cors from "@koa/cors";
import json from "koa-json";
import jwt from "koa-jwt";
import log from "./utils/logger.js";
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
  requestPassChange,
  processPassChange,
} from "./controller/user.controller.js";
import {
  fetchAllProducts,
  getProductById,
  editProduct,
  createProduct,
} from "./controller/product.controller.js";
import {
  fetchMemberData,
  fetchMemberQR, checkMemberIn
} from "./controller/member.controller.js";
import {
  fetchFullStorage,
  getStorageItemById,
  updateStorageItem,
  createStorageItem,
} from "./controller/storage.controller.js";
import {
  getTicketValue,
  sessionExists,
  sessionStatus,
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
import { fetchAllRefills } from "./controller/refill.controller.js";
import { createNewOrder } from "./controller/order.controller.js";
createNewOrder;
import initDB from "./db/connect.js";

initDB();

config({ path: Path.resolve(".env") });

const app = new Koa();
const router = new Router({
  prefix: '/api'
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err.message);
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
    secret: "HBocGnplIiwiiUEFjF1bHZvb",
  }).unless({
    path: ["/api/auth/login", "/register", "/user/request-change"],
  })
);

// ---- START APIs ----
// ---- AUTH ----

router.post("/register", async (ctx) => {
  const creator =
    ctx.$user != null && ctx.$user.username != null
      ? ctx.$user.username
      : "Public Request";
  log(creator, "** New Member **", "info");
  try {
    // if (ctx.$user.accessLevel === "ADMIN") {
    const registerUser = await register(ctx.request.body.newUser, creator);
    ctx.status = 200;
    ctx.body = { user: registerUser };
    // } else {
    //   log(
    //     ctx.$user.username,
    //     `Attept of ${ctx.$user.accessLevel} to register ${ctx.request.body.newUser.accessLevel} - ${ctx.request.body.newUser.firstname} ${ctx.request.body.newUser.lastname}`,
    //     "error"
    //   );
    //   ctx.body = "Forbidden!";
    //   ctx.status = 401;
    // }
  } catch (error) {
    log(
      ctx.$user != null && ctx.$user.username != null
        ? ctx.$user.username
        : "Unknown",
      error,
      "error"
    );
    ctx.body = error.message;
    ctx.status = error.status;
  }
}),
  router.post("/register-simple", async (ctx) => {
    log(ctx.$user.username, "** New Member **", "info");
    try {
      if (
        ctx.$user.accessLevel === "ADMIN" ||
        ctx.$user.accessLevel === "STAFF" ||
        ctx.$user.accessLevel === "SERGEANT"
      ) {
        const registerUser = await registerSimple(
          ctx.request.body.newUser,
          ctx.$user.username
        );
        ctx.status = 200;
        ctx.body = { registerUser };
      } else {
        ctx.status = 401;
      }
    } catch (error) {
      log(ctx.$user.username, error, "error");
      ctx.body = error.message;
      ctx.status = error.status;
    }
  }),
  router.post("/auth/login", async (ctx) => {
    console.log(ctx)
    try {
      const userLoging = await login(
        ctx.request.body.username,
        ctx.request.body.password
      );
      ctx.status = 200;
      ctx.body = userLoging;
    } catch (error) {
      log(ctx.request.body.username, error, "error");
      ctx.body = error.message;
      ctx.status = error.status;
    }
  }),
  router.get("/auth/user", async (ctx) => {
    try {
      const user = ctx.$user;
      log(user);
      delete user._doc.password;
      ctx.status = 200;
      ctx.body = user;
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  }),
  // ---- MEMBERS ----
  router.post("/member/has-checked-in", async (ctx) => {
    const userStatus = await hasCheckedIn(ctx.$user.username, ctx.request.body.sessionId, ctx.$user._id)
    ctx.status = 200;
    ctx.body = userStatus;
  });

  router.post("/member/checkin", async (ctx) => {
    const userStatus = await checkMemberIn(ctx.$user.username, ctx.request.body.sessionId, ctx.$user._id)
    ctx.status = 200;
    ctx.body = userStatus;
  });

  router.get("/member-status", async (ctx) => {
    try {
      const userStatus = await fetchMemberData(ctx.$user._id);
      ctx.status = 200;
      ctx.body = { userStatus: userStatus };
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  });

router.get("/member-qr", async (ctx) => {
  //try {
  const qr = await fetchMemberQR(ctx.$user._id);
  ctx.status = 200;
  ctx.body = { qr };
  //  } catch (error) {
  //    ctx.body = error;
  //    ctx.status = 500;
  // log(error);
  //return handleError(ctx, error);
  //  }
});
// ---- SESSION ----

router.get("/ticket-value", async (ctx) => {
  try {
    const value = await getTicketValue(ctx.$user.username);
    ctx.status = 200;
    ctx.body = { clovers: value };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/session/active", async (ctx) => {
  try {
    const session = await sessionExists();
    ctx.status = 200;
    ctx.body = { status: session };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/session/status/:sessionId", async (ctx) => {
  try {
    const status = await sessionStatus(
      ctx.params.sessionId,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = status;
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
    const session = await activateNewSession(
      ctx.request.body.sessionData,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = session;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/session/update", async (ctx) => {
  log(ctx.$user.username, "** New Session Update **", "info");
  try {
    const session = await updateActiveSession(
      ctx.request.body.sessionData,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = session;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

// ---- REFILLS ----
router.get("/refills", async (ctx) => {
  try {
    const refills = await fetchAllRefills(ctx.$user.username);
    ctx.status = 200;
    ctx.body = refills;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

// ---- PRODUCTS ----

router.get("/products", async (ctx) => {
  try {
    const products = await fetchAllProducts(ctx.$user.username);
    ctx.status = 200;
    ctx.body = products;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/product/get/:id", async (ctx) => {
  try {
    const item = await getProductById(ctx.params.id, ctx.$user.username);
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/product/create", async (ctx) => {
  log(ctx.$user.username, "** New Product **", "info");
  try {
    const createdProductId = await createProduct(
      ctx.request.body.itemData,
      ctx.$user.username
    );
    ctx.body = createdProductId;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/product/edit/:id", async (ctx) => {
  log(ctx.$user.username, "** Product Edit **", "info");
  try {
    const updatedProduct = await editProduct(
      ctx.params.id,
      ctx.request.body.itemData
    );
    ctx.body = updatedProduct;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 500;
  }
});

// ---- STORAGE ----

router.get("/storage/all", async (ctx) => {
  try {
    const items = await fetchFullStorage(ctx.$user.username);
    ctx.status = 200;
    ctx.body = items;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.get("/storage/get/item/:id", async (ctx) => {
  try {
    const item = await getStorageItemById(ctx.params.id, ctx.$user.username);
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/storage/update-item", async (ctx) => {
  log(ctx.$user.username, "** Storage Item Update **", "info");
  try {
    const item = await updateStorageItem(
      ctx.request.body.storageItem,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/storage/create-item", async (ctx) => {
  log(ctx.$user.username, "** New Storage Item **", "info");
  console.log(ctx.request.body.storageItem);
  try {
    const item = await createStorageItem(
      ctx.request.body.storageItem,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = item;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

// ---- USER ----

router.get("/users", async (ctx) => {
  try {
    const users = await fetchAllUsers(ctx.$user.username);
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    console.log(error);
    ctx.body = error.message;
    ctx.status = 500;
  }
});

router.get("/profile/:id", async (ctx) => {
 // try {
    const user = await getUserById(ctx.params.id);
    ctx.status = 200;
    ctx.body = user;
  // } catch (error) {
  //   ctx.body = error;
  //   ctx.status = 500;
  // }
});

router.get("/user/:id/pay-ticket", async (ctx) => {
  try {
    const newClovers = await userTicketPayment(
      ctx.params.id,
      null,
      null,
      ctx.$user.username
    );
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/:id/pay-ticket", async (ctx) => {
  try {
    log(
      ctx.$user.username,
      `** New ${ctx.request.body.ticketValue} Ticket **`,
      "info"
    );
    const newClovers = await userTicketPayment(
      ctx.params.id,
      ctx.request.body.ticketValue,
      ctx.request.body.donationMethod
    );
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/:id/refill", async (ctx) => {
  try {
    log(ctx.$user.username, "** New Refill **", "info");
    const newClovers = await refillUser(
      ctx.$user.username,
      ctx.params.id,
      ctx.request.body.newClovers,
      ctx.request.body.method,
      ctx.request.body.sessionId
    );
    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/request-change", async (ctx) => {
  log(ctx.request.body.email, `Requesting password change`, "info");
  try {
    const passRequestCode = await requestPassChange(ctx.request.body.email);
    ctx.status = 200;
    ctx.body = passRequestCode;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
});

router.post("/user/:id/change", async (ctx) => {
  try {
    const passChange = await processPassChange(
      ctx.params.id,
      ctx.request.body.code,
      ctx.request.body.newPass
    );
    log(ctx.$user.username, "Successfull password change!", "info");
    ctx.status = 200;
    ctx.body = passChange;
  } catch (error) {
    console.log(error);
    ctx.body = error.message;
    ctx.status = 500;
  }
});

// ---- ORDERS ----

router.post("/user/:id/new-order", async (ctx) => {
  try {
    log(ctx.$user.username, "** New Order **", "info");
    const newClovers = await registerNewOrder(
      ctx.params.id,
      ctx.request.body.grandTotal,
      ctx.request.body.content,
      ctx.request.body.sessionId,
      ctx.$user.username
    );

    ctx.status = 200;
    ctx.body = { availableClovers: newClovers };
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 500;
  }
});

// ---- END APIs ----

try {
  app.use(async (ctx, next) => {
    console.log(ctx)
    const jwtUser = ctx.state?.user?.data;
    if (jwtUser != null && jwtUser.username) {
      try {
        ctx.$user = await findUserByUsername(jwtUser.username);
        if (ctx.$user == null) {
          throw new Error();
        }
      } catch (ex) {
        console.log(ex);
        console.log(ex.message);
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
