import { getEventImageUrl } from "@/api/events/controller";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/*
 1. create a file that handle qr generate for student attendance
 2. get the data from student qr
 3. upload to local API 
 4. display data collected
 5. try to print 


*/
const test = () => {
  const [imageState, setImageState] = useState();

  useEffect(() => {
    const getEventImage = async () => {
      try {
        const image = await getEventImageUrl("69d319b84a055f6c2a57bd69");

        // setImageState(image )
        console.log(image);
      } catch (error) {
        console.log(error);
      }
    };
    getEventImage();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text>test</Text>
      </View>
    </SafeAreaView>
  );
};

export default test;

const styles = StyleSheet.create({});
