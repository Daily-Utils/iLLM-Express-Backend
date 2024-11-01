import { User } from "../models/User.js";

export const updateUser = async (req, res) => {
  try {
    const { clerkId, email, fullName, imageUrl } = req.body;
  
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByClerkId = await User.findOne({ clerkId });

    // Case 1: If user exists by clerkId, update the user
    if (existingUserByClerkId) {
      existingUserByClerkId.name = fullName;
      existingUserByClerkId.profileImage = imageUrl;
      existingUserByClerkId.updatedAt = Date.now();

      await existingUserByClerkId.save();
      return res.status(200).send("User updated in database successfully");

    } else if (existingUserByEmail) {
      console.log("Duplicate email error");
      return res
        .status(400)
        .send("Email is already associated with another user");
    } else {
      const newUser = new User({
        clerkId: clerkId,
        email: email,
        name: fullName || "",
        profileImage: imageUrl || "",
      });

      await newUser.save();
      console.log("In else, creating new user");

      return res.status(200).send("User created in database successfully");
    }
  } catch (error) {
    console.error("Error updating database::>", error);
    return res.status(500).send("Error updating user in database");
  }
};
