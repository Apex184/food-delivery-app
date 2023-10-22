//Email

//notification

//otp

const textflow = require("textflow.js");

textflow.useKey("ZnA3uo7Wv8xKyK3DgbueBMsmDJrYNJgScPWcvUbP7OSSEWxb8sLayii00qWIRMoQ");

export const sendMessage = async (message: string, phone: string) => {

    textflow.sendSMS(message, phone, (err: any, res: any) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (5 * 60 * 1000));
    return { otp, otp_expiry };
}

export const onRequestOTP = async (otp: number, phoneNumber: string,) => {
    const accountSid = "AC48fa3926139264e4fb81c66491677882";
    const authToken = "834ce54f1afd0d2729852b39a8405a96";
    const phone = +15076205838
    const client = require('twilio')(accountSid, authToken);
    const message = await client.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: phone,
            to: '+234' + phoneNumber.slice(1, phoneNumber.length)
        });
    return message;

}