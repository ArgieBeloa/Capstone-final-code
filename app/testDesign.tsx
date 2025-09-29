import EventDisplay from "@/components/EventDisplay";
import { COLORS } from "@/constants/ColorCpc";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface EventDisplayProps {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
}

const TestDesign = () => {
  const data: EventDisplayProps[] = [
    {
      title: "PSTDay",
      time: "2pm",
      date: "September 22 2025",
      // imagePath: ""
    },
  ];
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }: { item: EventDisplayProps }) => (
          <View style = {{minHeight: 100, backgroundColor: COLORS.Primary, marginHorizontal: 10}}>
            <EventDisplay title={item.title} date={item.date} time={item.time} location={item.location} />
          </View>
        )}
      />
    </View>
  );
};

export default TestDesign;

const styles = StyleSheet.create({});
