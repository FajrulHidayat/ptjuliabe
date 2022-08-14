const { default: axios } = require("axios");

const sendNotification = (to, body, title, click) => {
  const rawBody = {
    to: to,
    collapse_key: "type_a",
    notification: {
      body: body,
      title: title,
      click_action: click,
      icon: "https://i.ibb.co/wdSSH9b/Group-208-3-crop.png",
    },
  };
  console.log(rawBody);
  const header = {
    Authorization:
      "key=AAAAWU-78IU:APA91bFQP93HE52aGuOLrDNDcqGP-gaq2ypYtb-8sCuSKKaKhgGi5OE_7nNbsaTu2kzABjwoaTzhCgKi-Gbsqqcjf0pJHd9nPRl2kHr5PuqSiJZ2hzj4pDizH2_muNsoUS6pjgaHrY95",
    "Content-Type": "application/json",
  };
  axios
    .post("https://fcm.googleapis.com/fcm/send", rawBody, { headers: header })
    .then(function (res) {
      console.log(res.status);
    })
    .catch(function (err) {
      console.log(err);
    });
};
module.exports = sendNotification;
