const User = require("../models/User");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
   return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email: email.toLowerCase(), password, role });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }     catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

       exports.login = async (req, res) => {
     try {
    const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

       const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
