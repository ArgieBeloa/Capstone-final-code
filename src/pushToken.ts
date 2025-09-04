// // utils/pushToken.ts
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

// export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
//   if (!Device.isDevice) {
//     console.log('Must use physical device for Push Notifications');
//     return null;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     console.log('Push notification permissions not granted');
//     return null;
//   }

//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   // console.log('Expo Push Token:', token);

//   // // Optional: Send token to your backend
//   // try {
//   //   await axios.post('http://192.168.254.102:8080/api/token', {
//   //     userId,
//   //     token,
//   //   });
//   //   console.log('Token sent to backend');
//   // } catch (error) {
//   //   console.error('Error sending token to backend:', error);
//   // }

//   return token;
// }


// utils/pushToken.ts

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('❌ Must use physical device for Push Notifications');
    return null;
  }

  try {
    // Ask permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Permission not granted for notifications');
      return null;
    }

    // Get Expo Push Token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('✅ Expo Push Token:', token);

    // Android-specific config
    if (Device.osName === 'Android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('🔥 Error getting push token:', error);
    return null;
  }
}
