import bcrypt from "bcryptjs"
bcrypt.hash("robert@123!", 12).then(console.log)
