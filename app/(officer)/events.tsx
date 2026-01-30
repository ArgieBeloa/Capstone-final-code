import { getAllStudents, sendExpoNotification } from "@/api/admin/controller";
import {
  fetchEventImageById,
  getAllEvents,
  getEventImageByLocation,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { QrGeneratorProps } from "@/api/events/utils";
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

const Events = () => {
  const { eventData, studentData, studentToken } = useUser();
  const router = useRouter();

  const [suggestedTitleState, setSuggestedTitleState] = useState<
    { eventId: string; eventTitle: string }[]
  >([]);
  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventState, setEventState] = useState<EventModel[]>(eventData);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [eventDataQR, setEventDataQR] = useState<QrGeneratorProps>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedTitle, setSelectedTitle] = useState("All");

  const [imageUri, setImageUri] = useState<string | null>(null);

  const navigationTitle = ["All", "Technology", "Academic", "Health", "Others"];
  // const dateString = new Date(Date.now()).toString();

  const handleViewDetails = (id: string) => {
    router.push(`../officerEventDetails/${id}`);
  };

  const handleQrGenerator = (
    eventId: string,
    eventTitle: string,
    officerToken: string,
  ) => {
    // ✅ Clean token before putting it in the QR
    const cleanToken = officerToken.replace(/^Bearer\s*/i, "").trim();
    const data: QrGeneratorProps = {
      eventId,
      eventTitle,
      officerToken: cleanToken,
    };
    setEventDataQR(data);
    console.log("✅ QR data created:", data);
  };

  // 🧠 Fetch all data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (eventData?.length) {
          const students = await getAllStudents(studentToken);

          // get students expo token
          const notificationIds = students
            .filter((s) => !!s.notificationId)
            .map((student) => ({
              notificationId: student.notificationId,
            }));

          setAllTokens(notificationIds);

          // 🎯 Fetch all events
          const events = await getAllEvents(studentToken);
          setEventState(events);

          const eventIdAndTitles = events.map(
            (event: { id: any; eventTitle: any }) => ({
              eventId: event.id,
              eventTitle: event.eventTitle,
            }),
          );
          setSuggestedTitleState(eventIdAndTitles);
          //  const image= getEventImageUrl("")
          // const image = fetchEventImageById("68fe3f9be8afa9ebda9d2fd8", studentToken);
          // console.log(image);
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // 📢 Send announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);

      const extactAllTokens: string[] = allTokens.map(
        (item) => item.notificationId,
      );

      console.log(extactAllTokens);
      await sendExpoNotification(studentToken, {
        tokens: extactAllTokens,
        title,
        body: message,
      });
      console.log(title);

      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedIndex === 0) {
      setEventState(eventData);
      console.log(eventData);
    } else {
      const filtered = eventData.filter(
        (event) => event.eventCategory === selectedTitle,
      );
      setEventState(filtered);
    }
  }, [selectedTitle, eventData, selectedIndex]);

  const RenderEventItem = ({ item }: { item: EventModel }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        console.log(item.eventImageUrl);
        try {
          const uri = await fetchEventImageById(
            item.eventImageUrl!,
            studentToken,
          );
          setImageUri(uri);
        } catch (error) {
          console.error(`❌ Failed to load image for event ${item.id}:`, error);
        } finally {
          setLoadingImage(false);
        }
      };

      loadImage();
    }, [item.eventImageUrl]);

    return (
      <TouchableHighlight
        onPress={() => handleViewDetails(item.id)}
        underlayColor="transparent"
      >
        <View style={styles.eventFlatListContainer}>
          <ImageBackground
            source={
              imageUri
                ? { uri: imageUri }
                : getEventImageByLocation(item.eventLocation)
            }
            style={styles.imageBgFlatlist}
            resizeMode="cover"
          >
            {/* Loading overlay */}
            {loadingImage && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            {/* QR generated Button */}
            <Pressable
              style={styles.qrGeneratorbtn}
              onPress={() => {
                // setModalIsVisible(true);
                // handleQrGenerator(item.id, item.eventTitle, studentToken);
                // router.push("/(officer)/OfficerScanner/officerScanner");
                router.push(`../OfficerScanner/${item.id}`);
              }}
            >
              <MaterialIcons name="qr-code-2" size={24} color="black" />
            </Pressable>

            {/* Event Title */}
            <View style={{ marginTop: "auto", paddingLeft: 10 }}>
              <Text style={styles.eventTitleFlatlist}>{item.eventTitle}</Text>
            </View>

            {/* Info Row */}
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

              <Entypo name="location" size={17} color={COLORS.textColorWhite} />
              <Text style={styles.eventTitleTextFlatlist}>
                {item.eventLocation}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <HeaderOfficer
          officerName={studentData.studentName}
          eventSuggestionData={suggestedTitleState}
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
              renderItem={({ item }) => <RenderEventItem item={item} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ color: "Black" }}>No events available!</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={{ color: "Black" }}>No events available!</Text>
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
