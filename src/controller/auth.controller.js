import PrettyError from "../utils/errors.js";
import jwt from "jsonwebtoken";
import {
  getUserByUsernameFromDb,
  createUserInDb,
  isUsernameUnique,
  isEmailUnique, isPhoneUnique
} from "./../services/user.service.js";
import bcrypt from "bcryptjs";
import log from './../utils/logger.js'
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
      status: 400,
      message: `Username ${newUserObj.username} is taken!`,
      inFile: EMITTER_ID,
    });
  }
  // validate unique email
  const emailCheck = await isEmailUnique(newUserObj.email);
  if (emailCheck !== true) {
    throw new PrettyError({
      code: "email-taken",
      status: 400,
      message: `Email is taken!`,
      inFile: EMITTER_ID,
    });
  }

    // validate unique phone
    const phoneCheck = await isPhoneUnique(newUserObj.email);
    if (phoneCheck !== true) {
      throw new PrettyError({
        code: "phone-taken",
        status: 400,
        message: `Phone is taken!`,
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
    log(creator, `Creating new ${newUserObj.acceessLevel} -  username: ${newUserObj.username} - name: ${newUserObj.firstname} ${newUserObj.lastname}`, 'info')
    return await createUserInDb(newUserObj);
  } catch (error) {
    throw new PrettyError({
      status: 500,
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
      status: 400,
      message: "Username is taken!",
      inFile: EMITTER_ID,
    });
  }
  // validate unique email
  const emailCheck = await isEmailUnique(newUserObj.email);
  if (emailCheck !== true) {
    throw new PrettyError({
      code: "email-taken",
      status: 400,
      message: "Email is taken!",
      inFile: EMITTER_ID,
    });
  }

  // register the user with the specified password
  try {
    newUserObj.acceessLevel = "MEMBER";
    newUserObj.createdBy = creator;
    log(creator, `Registering temp new ${newUserObj.acceessLevel} -  username: ${newUserObj.username} - name: ${newUserObj.firstname} ${newUserObj.lastname}`, 'info')
    return await createUserInDb(newUserObj);
  } catch (error) {

    console.log(error)
    throw new PrettyError({
      status: 500,
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
      status: 400,
      code: "incomplete_credentials",
      message: "Invalid credentials!",
      inFile: EMITTER_ID,
    });
  }
  const user = await getUserByUsernameFromDb(username);
  if (user == null) {
    throw new PrettyError({
      status: 404,
      code: "user_not_found",
      message: `Invalid credentials!`,
      inFile: EMITTER_ID,
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new PrettyError({
      status: 400,
      code: "invalid_password",
      message: `Invalid credentials!`,
      inFile: EMITTER_ID,
    });
  }
  const expiresAt = Math.floor(Date.now()) + 6 * 60 * 60 * 1000;
  const expiresAtDate = new Date(expiresAt).toISOString();
  const token = jwt.sign(
    {
      data: {
        username: user.username,
        accessLevel: user.accessLevel != null ? user.accessLevel : "MEMBER",
      },
      // 60 seconds * 60 minutes * 24 = 1 day
      expiresAt,
    },
    //process.env.JWT_SECRET
    "HBocGnplIiwiiUEFjF1bHZvb"
  );
  log(user.username, `Logged in with access level ${user.accessLevel} until ${expiresAtDate}.`, 'info')
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
