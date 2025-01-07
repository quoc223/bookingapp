const express = require('express');
const router = express.Router();
const config = require('config');
const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
require('dotenv').config();

const  pool  = require('../config/connectdatabase');
const PaymentService = require('../services/paymentService');

// Utility function to sort object
function sortObject(obj) {
    let sorted = {};
    let str = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (let i = 0; i < str.length; i++) {
        sorted[str[i]] = encodeURIComponent(obj[str[i]]).replace(/%20/g, "+");
    }
    return sorted;
}

// Create Payment URL Controller
router.post('/create_payment_url', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const { amount, language, bankCode, appointmentId } = req.body; // Lấy appointmentId từ body

    if (!appointmentId) {
        return res.status(400).json({ message: 'appointmentId is required' });
    }

    const locale = language || 'vn';
    const currCode = 'VND';
    const orderId = `${appointmentId}_${moment(date).format('DDHHmmss')}`;


    const vnp_Params = sortObject({
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: JSON.stringify({ orderId }), // Thêm appointmentId vào thông tin đơn hàng
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        ...(bankCode && { vnp_BankCode: bankCode }),
    });

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    res.status(200).json({
        paymentUrl: `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`,
        appointmentId, // Trả về appointmentId để tham khảo
    });
});



router.get('/vnpay_return', async (req, res) => {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        if (!secureHash) {
            return res.json({
                success: false,
                message: 'Missing security hash',
                error_code: 'MISSING_HASH',
            });
        }

        const params = { ...vnp_Params };
        delete params['vnp_SecureHash'];
        delete params['vnp_SecureHashType'];

        const sortedParams = sortObject(params);
        const secretKey = process.env.VNP_HASHSECRET;
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            const responseCode = vnp_Params['vnp_ResponseCode'];
            const orderInfo = JSON.parse(vnp_Params['vnp_OrderInfo']);
            const orderId = orderInfo.orderId;
            const amount = parseInt(vnp_Params['vnp_Amount'], 10) / 100;
            const appointmentId = orderId.split('_')[0];

            try {
                const [results] = await pool.query(
                    'CALL InsertPayment(?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        appointmentId,
                        amount,
                        'TRANSFER',
                        responseCode === '00' ? 'PAID' : 'PENDING',
                        orderId,
                        responseCode,
                        vnp_Params['vnp_BankCode'],
                        vnp_Params['vnp_BankTranNo'],
                    ]
                );

                const insertId = results[0][0].insertId;
                const [paymentRecords] = await pool.query(
                    'SELECT * FROM payment WHERE payment_id = ?',
                    [insertId]
                );

                if (!paymentRecords || paymentRecords.length === 0) {
                    throw new Error('Payment record not found after insertion');
                }

                const paymentRecord = paymentRecords[0];

                // Redirect to frontend with payment details as query params
                return res.redirect(
                    `http://localhost:5173/appointment/payment/vnpay_return?success=${responseCode === '00'}&message=${encodeURIComponent(
                        responseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán không thành công'
                    )}&payment_id=${paymentRecord.payment_id}&appointment_id=${paymentRecord.appointment_id}&amount=${paymentRecord.amount}&status=${paymentRecord.status}&transaction_ref=${orderId}&bank_code=${vnp_Params['vnp_BankCode']}&payment_date=${encodeURIComponent(
                        paymentRecord.payment_date
                    )}&transaction_no=${vnp_Params['vnp_TransactionNo']}&vnpay_response_code=${responseCode}`
                );
            } catch (dbError) {
                console.error('Database error:', dbError);
                return res.json({
                    success: false,
                    message: 'Lỗi lưu dữ liệu thanh toán',
                    error_code: 'DB_ERROR',
                    error_details: dbError.message,
                });
            }
        } else {
            return res.redirect(
                `http://localhost:5173/appointment/payment/vnpay_return?success=false&message=${encodeURIComponent(
                    'Xác thực giao dịch thất bại'
                )}&error_code=INVALID_HASH`
            );
        }
    } catch (error) {
        console.error('Error processing payment return:', error);
        return res.redirect(
            `http://localhost:5173/appointment/payment/vnpay_return?success=false&message=${encodeURIComponent(
                'Lỗi xử lý giao dịch'
            )}&error_code=SYSTEM_ERROR&error_details=${encodeURIComponent(error.message)}`
        );
    }
});

// Cấu hình VNPAY
const VNP_API_URL = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
const VNP_TMN_CODE = "TMNCODE"; // Mã TMN Code
const VNP_HASH_SECRET = "SECRETKEY"; // Secret Key
const VNP_VERSION = "2.1.0";
const VNP_COMMAND = "refund";

router.post("/refund", async (req, res) => {
    try {
        const {
            vnp_TxnRef,
            vnp_Amount,
            vnp_TransactionType,
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_OrderInfo,
        } = req.body;

        // Kiểm tra các tham số bắt buộc
        if (!vnp_TxnRef || !vnp_Amount || !vnp_TransactionType || !vnp_TransactionDate || !vnp_CreateBy || !vnp_OrderInfo) {
            return res.status(400).json({ message: "Thiếu tham số bắt buộc!" });
        }

        // Tạo mã yêu cầu duy nhất
        const vnp_RequestId = `Refund${Date.now()}`;
        const vnp_CreateDate = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14); // yyyyMMddHHmmss
        const vnp_IpAddr = req.ip || "127.0.0.1";

        // Chuỗi dữ liệu để ký checksum
        const dataToHash = [
            vnp_RequestId,
            VNP_VERSION,
            VNP_COMMAND,
            VNP_TMN_CODE,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            "", // vnp_TransactionNo (nếu không có thì để trống)
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        ].join("|");

        // Tạo checksum
        const vnp_SecureHash = crypto
            .createHmac("sha256", VNP_HASH_SECRET)
            .update(dataToHash)
            .digest("hex");

        // Payload gửi đi
        const payload = {
            vnp_RequestId,
            vnp_Version: VNP_VERSION,
            vnp_Command: VNP_COMMAND,
            vnp_TmnCode: VNP_TMN_CODE,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
            vnp_SecureHash,
        };

        // Gửi yêu cầu HTTP POST tới VNPAY
        const response = await axios.post(VNP_API_URL, payload, {
            headers: { "Content-Type": "application/json" },
        });

        // Xử lý phản hồi từ VNPAY
        const data = response.data;
        if (data.vnp_ResponseCode === "00") {
            return res.status(200).json({ message: "Hoàn tiền thành công", data });
        } else {
            return res.status(400).json({ message: "Hoàn tiền thất bại", error: data });
        }
    } catch (error) {
        console.error("Lỗi khi xử lý yêu cầu hoàn tiền:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;
