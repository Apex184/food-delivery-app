"use strict";
//Email
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.GenerateOtp = exports.sendMessage = void 0;
//notification
//otp
const textflow = require("textflow.js");
textflow.useKey("ZnA3uo7Wv8xKyK3DgbueBMsmDJrYNJgScPWcvUbP7OSSEWxb8sLayii00qWIRMoQ");
const sendMessage = async (message, phone) => {
    textflow.sendSMS(message, phone, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    });
};
exports.sendMessage = sendMessage;
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (5 * 60 * 1000));
    return { otp, otp_expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOTP = async (otp, phoneNumber) => {
    const accountSid = "AC48fa3926139264e4fb81c66491677882";
    const authToken = "834ce54f1afd0d2729852b39a8405a96";
    const phone = +15076205838;
    const client = require('twilio')(accountSid, authToken);
    const message = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        from: phone,
        to: '+234' + phoneNumber.slice(1, phoneNumber.length)
    });
    return message;
};
exports.onRequestOTP = onRequestOTP;
//# sourceMappingURL=NotificationUtility.js.map