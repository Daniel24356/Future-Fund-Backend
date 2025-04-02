import axios from "axios"

const sendPushNotification = async () => {
   const notificationData = {
      app_id: "5ac84d9d-2f6c-4656-adc6-3543ccaa0bd1",
      included_segments: ["All"], 
      headings: { en: "Daily Reminder 📢" },
      contents: { en: "Don't forget to transfer today! 🚀" },
   };

   try {
      const response = await axios.post("https://onesignal.com/api/v1/notifications", notificationData, {
         headers: {
            "Content-Type": "application/json",
            "Authorization": "Key os_v2_app_llee3hjpnrdfnloggvb4zkql2gfbiffdbkyeas5xthquvicrhubquq5xhd7omiv7urdfi2lof25p7wxgy6prhje4zamjtivhmbmok4i",
         },
      });

      console.log("Push Notification Sent Successfully!", response.data);
   } catch (error: any) {
      console.error("Error sending notification:", error.response.data);
   }
};

export default sendPushNotification