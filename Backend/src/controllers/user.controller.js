import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log({ accessToken, refreshToken })

    user.refreshToken = refreshToken;
    //locally saved access token
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Some Problem encountered while generating Tokens");
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, Email, fullName, password, phone_number} = req.body;

  const UserExisted = await User.findOne({
    $or: [{ username }, { Email }],
  });
  if (UserExisted) {
    throw new ApiError(409, "User Exists Already");
  }

  const user = await User.create({
    username: username.tolowercase(),
    Email,
    fullName,
    password,
    phone_number,
    role:"user", // Assign role
  });

 const userCreated = await User.findById(user._id).select(
   "-password -refreshToken"
 );

 // check for user creation
 if (!userCreated) {
   throw new ApiError(500, "User register error");
 }

  res.status(201).json(new ApiResponse("User registered successfully", user));
});

// User Login
const userLogin = asyncHandler(async (req, res) => {
  const { Email, password, username } = req.body;

  if (!username && !Email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { Email }] });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email/username or password");
  }



  //generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //cookie only modified by server
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },

        "Logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refresh_accessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Expired Refresh Token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newRefreshToken, accessToken } =
      await generateAccessandRefreshToken(user._id);
      user.refreshToken = newRefreshToken;
      await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access Token Refresh Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to Refresh the Tokens");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

export { registerUser, userLogin, logoutUser,refresh_accessToken,changeCurrentPassword };