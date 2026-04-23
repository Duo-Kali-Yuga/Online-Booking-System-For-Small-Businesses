// Inside updateMe in userController.js
export const updateMe = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = { name };

    // If a new file is uploaded, use it
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    } 
    // If the user explicitly sent an empty string to remove the photo
    else if (avatar === "") {
      updateData.avatar = "";
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};