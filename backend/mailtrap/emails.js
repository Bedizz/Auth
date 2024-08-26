import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient,mailtrapSender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const res = await mailtrapClient.send({
            from:mailtrapSender,
            to:recipient,
            subject:"Verify your Account",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully",res);
        
        
    } catch (error) {
        console.log("Error sending verification", error);
        throw new Error (`Error sending verification email: ${error}` )
    }

}