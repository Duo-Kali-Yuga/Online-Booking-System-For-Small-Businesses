// Inside updateMe in userController.js
// export const updateMe = async (req, res) => {
//   try {
//     const { name, avatar } = req.body;
//     const updateData = { name };

//     // If a new file is uploaded, use it
//     if (req.file) {
//       updateData.avatar = `/uploads/avatars/${req.file.filename}`;
//     } 
//     // If the user explicitly sent an empty string to remove the photo
//     else if (avatar === "") {
//       updateData.avatar = "";
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       updateData,
//       { new: true }
//     );

//     res.json({ success: true, data: updatedUser });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const updateMe = async (req, res) => {
//   try {
//     const updateData = { name: req.body.name };

//     // This is where the avatar is actually saved to the User document
//     if (req.file) {
//       updateData.avatar = `/uploads/avatars/${req.file.filename}`;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       updateData,
//       { returnDocument: 'after' }
//     );

//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateMe = async (req, res) => {
  try {
    // LOGGING: This will show in your terminal exactly what arrived
    console.log("Incoming Body:", req.body);
    console.log("Incoming File:", req.file);

    // 1. Build the update object carefully
    const updateData = {};
    
    // Only update name if it was actually sent in the body
    if (req.body.name) {
      updateData.name = req.body.name;
    }

    // 2. Handle the file upload path
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    } 

    // 3. Database operation
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        returnDocument: 'after',
        runValidators: true // Ensures the new data follows your Schema rules
      }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    // This will print the EXACT reason for the 500 error in your console
    console.error("UpdateMe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};