import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EventDetails = () => {
    const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default EventDetails

const styles = StyleSheet.create({})