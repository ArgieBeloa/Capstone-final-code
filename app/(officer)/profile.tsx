import LinearbackGround from "@/components/LinearBackGround";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Profile = () => {
  return (
    <LinearbackGround>
      <SafeAreaView>
        <View>
          <Text>Profile</Text>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Profile;

const styles = StyleSheet.create({});
