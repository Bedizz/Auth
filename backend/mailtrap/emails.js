import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient,mailtrapSender } from "./mailtrap.config.js";


export const sendWelcomeEmail  = async (email,name) => {
    const recipient = [{email}]

    try {
        const res = await mailtrapClient.send({
            from:mailtrapSender,
            to:recipient,
            template_uuid: "173fd8aa-796e-484d-acf9-d7b882529ab8",
            template_variables: {
              "company_info_name": "Auth Company",
              "name": name,
            }
        })
        console.log("Email sent successfully",res);
        
        
    } catch (error) {
        console.log("Error sending verification", error);
        throw new Error (`Error sending verification email: ${error}` )
    }

}
export const sendVerificationEmail = async (email,verificationToken ) => {
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
export const sendPasswordResetEmail = async (email,resetURL) => {
const recipient = [{email}]
try {
    const res = await mailtrapClient.send({
        from:mailtrapSender,
        to:recipient,
        subject:"Reset your password",
        html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
        category:"Password reset"
    })
    console.log("Email sent successfully",res);
    
} catch (error) {
    console.log("Error sending verification", error);
    throw new Error (`Error sending verification email: ${error}` )
}
}
export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]
    try {
        const res = mailtrapClient.send({
            from:mailtrapSender,
            to:recipient,
            subject:"Password reset successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        })
        
    } catch (error) {
        console.log("Error sending verification", error);
        throw new Error (`Error sending verification email: ${error}` )
    }
}