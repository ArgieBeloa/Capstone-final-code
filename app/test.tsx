import UploadEventImage from "@/components/UploadEventImage";
import React from "react";
import { StyleSheet, View } from "react-native";

const test = () => {
  return (
    <View>
      {/* Upload image only AFTER event is created */}

      <UploadEventImage
        eventId={"68ff2775a5ee0ff21054417d"}
        token={
          "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyMDU1MDAwMSIsImlhdCI6MTc2MTU3OTIzNiwiZXhwIjoxNzYxNjIyNDM2LCJyb2xlIjoiQURNSU4ifQ.bIJ3v2sV9hUmvwD4bnjYME4kiErcGkHVn5aqqoG9L80LEb2OO-zyur071upkEvkx"
        }
      />
    </View>
  );
};

export default test;

const styles = StyleSheet.create({});
