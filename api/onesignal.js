const OneSignal = require("onesignal-node")
const { restApiOS, appOSId } = require('../.env')

module.exports = app => {

    const notification_user = async (usersId, stringNotification) =>{
        console.log("Notificaçao", usersId, stringNotification)
        const client = new OneSignal.Client(appOSId, restApiOS);
    
        const notification = {
            name:'Spends',
            contents: {
                'tr': 'Yeni bildirim',
                'en': stringNotification,
            },
            include_external_user_ids: usersId,
            channel_for_external_user_ids: "push",
            isAndroid: true
        };
        
        try {
            const response = await client.createNotification(notification);
            console.log(response.body.id);
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    }
    

    return {notification_user}
            
};