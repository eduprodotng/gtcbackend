const twilio = require('twilio');

class TwilioConfig {
    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    }

    /**
     * Send a verification code via SMS.
     * @param {string} phone - The recipient's phone number.
     * @returns {Promise<object>} - The Twilio message object or an error.
     */

    async sendVerificationCode(phone) {
        try {
            const verification = await this.client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({
                channel: "sms",
                to: phone,
            });
            
            console.log(verification.sid);
            return verification;
        } catch (error) {
            console.error('Error sending verification code:', error.message || error);
            return error.message || error;
            //throw new Error('Failed to send verification code');
        }
    }


    /**
     * Verify a code for a given phone number.
     * @param {string} phone - The phone number to verify.
     * @param {string} code - The verification code entered by the user.
     * @returns {Promise<boolean>} - Returns true if verified successfully, otherwise false.
     */

    async verifyCode(phone, code) {
        try {
            const verificationCheck = await this.client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
                .verificationChecks
                .create({ code: code, to: phone});
            
            if (verificationCheck.status === 'approved') {
                console.log('Verification successful for:', verificationCheck);
                return verificationCheck;
            } else {
                console.log('Verification failed for:', verificationCheck);
                return verificationCheck;
            }
        } catch (error) {
            console.error('Error verifying code:', error.message || error);
            //throw new Error('Failed to verify code');
            return error.message || error;
        }
    }
}

module.exports = new TwilioConfig();
