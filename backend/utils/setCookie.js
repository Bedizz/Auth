import jwt from "jsonwebtoken"
export const setCookie = (res,userId) => {
const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn: "7d",
})
res.cookie("token",token, {
    httponly: true, // protects against XSS attacks
    secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //protects against CSRF attacks
        maxAge: 7*24*60*60*1000,

})
return token;
}