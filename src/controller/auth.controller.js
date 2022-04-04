import PrettyError from "../utils/errors.js";
import jwt from "jsonwebtoken";
import {
  getUserByUsernameFromDb,
  createUserInDb,
  isUsernameUnique,
  isEmailUnique,
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
  return await getUserByUsernameFromDb(username);
};

export const register = async (newUserObj, creator) => {
  const usernameCheck = await isUsernameUnique(newUserObj.username);
  if (usernameCheck !== true) {
    throw new PrettyError({
      code: "username-taken",
      message: "Username is taken!",
      inFile: EMITTER_ID,
    });
  }
  // validate unique email
  const emailCheck = await isEmailUnique(newUserObj.email);
  if (emailCheck !== true) {
    throw new PrettyError({
      code: "email-taken",
      message: "Email is taken!",
      inFile: EMITTER_ID,
    });
  }

  //   if (!isValidPassword(newUserObj.password)) {
  //     throw new PrettyError({
  //       code: "auth.register.invalid-password",
  //       message:
  //         "The password must contain at least one lowercase char, one uppercase char, one digit and a symbol!",
  //       inFile: EMITTER_ID,
  //     });
  //   }

  // register the user with the specified password
  try {
    if (newUserObj.acceessLevel == null) {
      newUserObj.acceessLevel = "MEMBER";
    }
    const plainPass = newUserObj.password;
    newUserObj.password = await bcrypt.hash(plainPass, 10);
    newUserObj.createdBy = creator;
    newUserId = await createUserInDb(newUserObj);
    return newUserId;
  } catch (error) {
    throw new PrettyError({
      code: "auth.register.unknown",
      message: `Unknown error while register user for token ${newUserObj.username}!`,
      causedBy: error,
      inFile: EMITTER_ID,
    });
  }
};

export const registerSimple = async (newUserObj, creator) => {
  const usernameCheck = await isUsernameUnique(newUserObj.username);
  if (usernameCheck !== true) {
    throw new PrettyError({
      code: "username-taken",
      message: "Username is taken!",
      inFile: EMITTER_ID,
    });
  }
  // validate unique email
  const emailCheck = await isEmailUnique(newUserObj.email);
  if (emailCheck !== true) {
    throw new PrettyError({
      code: "email-taken",
      message: "Email is taken!",
      inFile: EMITTER_ID,
    });
  }

  // register the user with the specified password
  try {
    newUserObj.acceessLevel = "MEMBER";
    newUserObj.createdBy = creator;
    const newUserId = await createUserInDb(newUserObj);
    return newUserId;
  } catch (error) {
    console.log(error)
    throw new PrettyError({
      code: "auth.register.unknown",
      message: `Unknown error while register user for token ${newUserObj.username}!`,
      causedBy: error,
      inFile: EMITTER_ID,
    });
  }
};

export const login = async (username, password) => {
  if (username == null || password == null) {
    throw new PrettyError({
      code: "incomplete_credentials",
      message: "username or password missing from request.",
      inFile: EMITTER_ID,
    });
  }
  const user = await getUserByUsernameFromDb(username);
  if (user == null) {
    throw new PrettyError({
      code: "user_not_found",
      message: `username ${username} was not found in db.`,
      inFile: EMITTER_ID,
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new PrettyError({
      code: "invalid_password",
      message: `invalid password for username ${username}`,
      inFile: EMITTER_ID,
    });
  }
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const expiresAtDate = new Date(expiresAt * 1000).toISOString();
  console.log(expiresAtDate);
  const token = jwt.sign(
    {
      data: {
        username: user.username,
        acceessLevel: user.acceessLevel != null ? user.acceessLevel : "MEMBER",
      },
      // 60 seconds * 60 minutes * 24 = 1 day
      expiresAt,
    },
    //process.env.JWT_SECRET
    "HBocGnplIiwiiUEFjF1bHZvb"
  );
  return { token, expiresAt: expiresAtDate };
};

// export const changePassword = async () => {
//   const user = await users.findByUsername(username);
//   if (user == null) {
//     throw new PrettyError({
//       code: "user_unknown",
//       message: "user not found in db.",
//       inFile: EMITTER_ID,
//     });
//   }
//   if (user.password != null) {
//     const match = await bcrypt.compare(oldPass, user.password);
//     if (!match) {
//       throw new PrettyError({
//         code: "wrong_old_password",
//         message: "wrong old password",
//         inFile: EMITTER_ID,
//       });
//     }
//   }
//   if (!isValidPassword(newPass)) {
//     throw new PrettyError({
//       code: "invalid_new_password",
//       message: "new password does not meet requirements",
//       inFile: EMITTER_ID,
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
//     throw new PrettyError({
//       code: "update_error",
//       message: "error updating user in db",
//       causedBy: error,
//       inFile: EMITTER_ID,
//     });
//   }
//   return user.userId;
//};
