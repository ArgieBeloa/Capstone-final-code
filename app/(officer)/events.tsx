import { getAllStudents, sendExpoNotification } from "@/api/StudentService";
import FloatingButton from "@/components/FloatingButton";
import HeaderOfficer from "@/components/HeaderOfficer";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event, Student } from "../Oop/Types";

interface QrGeneratorProps {
  eventId: string;
  eventTitle: string;
  studentDateAttended: string;
}

const Events = () => {
  const { eventData, studentData, studentToken } = useUser();
  const router = useRouter();

  const [suggestionTitleState, setSuggestedTitleState] = useState([]);
  const [allTokens, setAllTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventState, setEventState] = useState<Event[]>(eventData);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [eventDataQR, setEventDataQR] = useState<QrGeneratorProps>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedTitle, setSelectedTitle] = useState("All");

  const navigationTitle = ["All", "Technology", "Academic", "Health", "Others"];
  const dateString = new Date(Date.now()).toString();

  const handleViewDetails = (id: string) => {
    router.push(`../officerEventDetails/${id}`);
  };

  const handleQrGenerator = (
    eventId: string,
    eventTitle: string,
    studentDateAttended: string
  ) => {
    const data: QrGeneratorProps = { eventId, eventTitle, studentDateAttended };
    setEventDataQR(data);
  };

  // Fetch all students for Expo tokens
  useEffect(() => {
    if (eventData?.length) {
      const eventIdAndTitles = eventData.map(
        (event: { id: any; eventTitle: any }) => ({
          eventId: event.id,
          eventTitle: event.eventTitle,
        })
      );
      setSuggestedTitleState(eventIdAndTitles);
    }

    const getStudents = async () => {
      try {
       const students = await getAllStudents(studentToken)
      
              const tokens = students
                .map((s: Student) => s.tokenId)
                .filter((t: any): t is string => !!t);
              setAllTokens(tokens);
      } catch (error) {
        console.error("❌ Failed to fetch students:", error);
      }
    };
    getStudents();
  }, []);

  // Filter events by category
  useEffect(() => {
    if (selectedTitle === "All") {
      setEventState(eventData);
    } else {
      const filtered = eventData.filter(
        (e: { eventCategory: string }) => e.eventCategory === selectedTitle
      );
      setEventState(filtered);
    }
  }, [selectedTitle, eventData]);

  // Send Announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);
      await sendExpoNotification({ tokens: allTokens, title, message });
      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error(
        "❌ Error sending announcement:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <HeaderOfficer
          officerName={studentData.studentName}
          eventSuggestionData={suggestionTitleState}
          handleSendAnnouncement={handleSendAnnouncement}
        />

        {/* CATEGORY NAVIGATION */}
        <View style={styles.categoryNav}>
          {navigationTitle.map((title, index) => {
            const isActive = selectedIndex === index;
            return (
              <TouchableHighlight
                key={index}
                style={[styles.categoryButton, isActive && styles.activeButton]}
                underlayColor="#ddd"
                onPress={() => {
                  setSelectedIndex(index);
                  setSelectedTitle(title);
                }}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    isActive && { color: COLORS.textColorWhite },
                  ]}
                >
                  {title}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>

        {/* EVENTS LIST */}
        <View style={{ flex: 1 }}>
          {eventState.length ? (
            <FlatList
              data={eventState}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Event }) => (
                <TouchableHighlight
                  onPress={() => handleViewDetails(item.id)}
                  underlayColor="transparent"
                >
                  <View style={styles.eventFlatListContainer}>
                    <ImageBackground
                      source={require("@/assets/images/auditorium.jpg")}
                      style={styles.imageBgFlatlist}
                      imageStyle={{ resizeMode: "cover" }}
                    >
                      {/* QR Button */}
                      <Pressable
                        style={styles.qrGeneratorbtn}
                        onPress={() => {
                          setModalIsVisible(true);
                          handleQrGenerator(
                            item.id,
                            item.eventTitle,
                            dateString
                          );
                        }}
                      >
                        <MaterialIcons
                          name="qr-code-2"
                          size={24}
                          color="black"
                        />
                      </Pressable>

                      {/* Event Title */}
                      <View style={{ marginTop: "auto", paddingLeft: 10 }}>
                        <Text style={styles.eventTitleFlatlist}>
                          {item.eventTitle}
                        </Text>
                      </View>

                      {/* Info */}
                      <View style={styles.eventInfoRow}>
                        <AntDesign
                          name="calendar"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventDate}
                        </Text>
                        <AntDesign
                          name="clockcircleo"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventTime}
                        </Text>
                        <Entypo
                          name="location"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventLocation}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableHighlight>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ color: "white" }}>No events available!</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={{ color: "white" }}>No events available!</Text>
            </View>
          )}
        </View>

        {/* QR MODAL */}
        <Modal
          visible={modalIsVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalIsVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text
                style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}
              >
                Event QR Code
              </Text>
              <QRCode
                value={JSON.stringify(eventDataQR)}
                size={200}
                backgroundColor="white"
                color="black"
              />
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalIsVisible(false)}
              >
                <Text>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* LOADING OVERLAY */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.textColorWhite} />
          </View>
        )}

        {/* FLOATING BUTTON */}
        <FloatingButton
          iconName="plus"
          onPress={() => router.push("../officerAddEvent/addEvent")}
        />
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Events;

const styles = StyleSheet.create({
  categoryNav: {
    backgroundColor: COLORS.Forth,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 5,
    flexDirection: "row",

    gap: 5,
    overflow: "hidden",
    zIndex: -1,
  },
  categoryButton: {
    backgroundColor: COLORS.Forth,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  categoryButtonText: {
    fontWeight: "500",
    color: "#000",
  },
  activeButton: {
    backgroundColor: COLORS.Secondary,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  eventFlatListContainer: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 150,
    

  },
  imageBgFlatlist: {
    flex: 1,
    // width: "100%",
    // minHeight:300,
    justifyContent: "flex-end",
    padding: 10,
    zIndex: -1,
  },
  eventTitleFlatlist: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textColorWhite,
    marginBottom: 5,
  },
  eventTitleTextFlatlist: {
    fontSize: 14,
    color: COLORS.textColorWhite,
    marginRight: 8,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 5,
    marginBottom: 5,
  },
  qrGeneratorbtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 5,
    marginLeft: "auto",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
