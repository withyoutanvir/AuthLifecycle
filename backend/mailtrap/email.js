import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, 	PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";




// Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("✅ Verification email sent", response);
	} catch (error) {
		 console.error("❌ error sending verification email:", error);

		throw new Error("Failed to send verification email");
	}
};


// Welcome Email using Template UUID
export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "4205ef30-f623-47cc-8a0a-951f77be1d3e",
			template_variables: {
				company_info_name: "Tanvir Singh",
				name:name,
			},
		});
    

		console.log("✅ Welcome email sent successfully", response);
	} catch (error) {
		console.error("❌ Error sending welcome email:", error.message);
   
		throw new Error("Failed to send welcome email");
	}
};


// Password Reset Email

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try{
		const response =await mailtrapClient.send({
			from: sender,
			to:recipient,
			subject:"Password Reset",
			html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category:"Password Reset",
		}
	);
	}catch(error){
		console.error("❌ Error sending password reset email:", error);
		

	}
}

// Password Reset Success Email
export const sendResetSuccessEmail = async (email) => {
		const recipient = [{ email }];
		try{
			const response = await mailtrapClient.send({
				from: sender,
				to: recipient,
				subject: "Password Reset Successful",
				html: PASSWORD_RESET_SUCCESS_TEMPLATE,
				category: "Password Reset Success",
			});
			console.log("✅ Password reset success email sent", response);


		}catch(error){
				console.log(`Error sending password reset success email:`,error);

				throw new Error(`Failed to send Password reset succes Email: ${error}`);

		}
}