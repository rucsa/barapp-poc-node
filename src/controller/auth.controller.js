import DetailedError from "../utils/errors.js";
import jwt from "jsonwebtoken";
import {
  getUserByUsernameFromDb,
  createUserInDb,
} from "./../services/user.service.js";
import bcrypt from "bcryptjs";
const EMITTER_ID = "src/controller/auth.controller.js";

// function isValidPassword(password) {
//   // (minimum: 1 upper char, 1 lower char, 1 special character, 1 digit)
//   return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
//     password
//   );
// }

export const findUserByUsername = async (username) => {
  return await getUserByUsernameFromDb(username)
} 

export const register = async (newUserObj) => {
  const requestingUser = await getUserByUsernameFromDb(newUserObj.username);
  if (requestingUser != null) {
    throw new DetailedError({
      code: "email-already-registered",
      message: "This username has already been registered!",
      emitter: EMITTER_ID,
    });
  }

//   if (!isValidPassword(newUserObj.password)) {
//     throw new DetailedError({
//       code: "auth.register.invalid-password",
//       message:
//         "The password must contain at least one lowercase char, one uppercase char, one digit and a symbol!",
//       emitter: EMITTER_ID,
//     });
//   }

  // register the user with the specified password
var newUserId
  try {
    const plainPass = newUserObj.password;
    newUserObj.password = await bcrypt.hash(plainPass, 10);
    //newUserObj.createdBy = token.createdBy
    newUserId = await createUserInDb(newUserObj);
  } catch (error) {
    throw new DetailedError({
      code: "auth.register.unknown",
      message: `Unknown error while register user for token ${newUserObj.username}!`,
      causedBy: error,
      emitter: EMITTER_ID,
    });
  }
  return newUserId
};

export const login = async (username, password) => {
  if (username == null || password == null) {
    throw new DetailedError({
      code: "incomplete_credentials",
      message: "username or password missing from request.",
      emitter: EMITTER_ID,
    });
  }
  const user = await getUserByUsernameFromDb(username);
  if (user == null) {
    throw new DetailedError({
      code: "user_not_found",
      message: `username ${username} was not found in db.`,
      emitter: EMITTER_ID,
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new DetailedError({
      code: "invalid_password",
      message: `invalid password for username ${username}`,
      emitter: EMITTER_ID,
    });
  }
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const expiresAtDate = new Date(expiresAt * 1000).toISOString();
  console.log(process.env.JWT_SECRET);
  const token = jwt.sign(
    {
      data: {
        username: user.username,
        acceessLevel: user.acceessLevel != null ? user.acceessLevel : "MEMBER",
      },
      // 60 seconds * 60 minutes * 24 = 1 day
      expiresAt,
    },
    process.env.JWT_SECRET
  );
  return { token, expiresAt: expiresAtDate };
};

// export const changePassword = async () => {
//   const user = await users.findByUsername(username);
//   if (user == null) {
//     throw new DetailedError({
//       code: "user_unknown",
//       message: "user not found in db.",
//       emitter: EMITTER_ID,
//     });
//   }
//   if (user.password != null) {
//     const match = await bcrypt.compare(oldPass, user.password);
//     if (!match) {
//       throw new DetailedError({
//         code: "wrong_old_password",
//         message: "wrong old password",
//         emitter: EMITTER_ID,
//       });
//     }
//   }
//   if (!isValidPassword(newPass)) {
//     throw new DetailedError({
//       code: "invalid_new_password",
//       message: "new password does not meet requirements",
//       emitter: EMITTER_ID,
//     });
//   }
//   const encryptedPassword = await bcrypt.hash(newPass, 10);
//   try {
//     await database.update({
//       collection: "CEZY.USERS",
//       data: { PASSWORD: encryptedPassword },
//       match: {
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     throw new DetailedError({
//       code: "update_error",
//       message: "error updating user in db",
//       causedBy: error,
//       emitter: EMITTER_ID,
//     });
//   }
//   return user.userId;
//};
