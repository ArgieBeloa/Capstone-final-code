import { sendExpoNotification } from "@/api/admin/controller";
import {
  fetchEventImageById,
  getAllEvents,
  getEventImageByLocation,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { QrGeneratorProps } from "@/api/events/utils";
import { getOfflineEvents } from "@/api/local/userOffline";
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
  const {
    eventData,
    studentData,
    studentToken,
    isUserHasInternet,
    eventDataOffline,
  } = useUser();
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
  const [allEvents, setAllEvents] = useState<EventModel[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchSuggestion, setSearchSuggestion] = useState<EventModel[]>([]);

  const [imageUri, setImageUri] = useState<string | null>(null);

  const navigationTitle = ["All", "Technology", "Academic", "Health", "Others"];
  // const dateString = new Date(Date.now()).toString();

  const handleViewDetails = (id: string) => {
    router.push(`../officerEventDetails/${id}`);
  };

  useEffect(() => {
    // offline mode
    const getOfflineData = async () => {
      const localDataEvents = await getOfflineEvents();
      const eventsLocal = localDataEvents.find((item: null) => item !== null);

      // set data
      setEventState(eventsLocal);
      setAllEvents(eventsLocal);
    };

    // online mode event data
    const getEvent = async () => {
      const events = await getAllEvents(studentToken);
      setAllEvents(events);
      setEventState(events);
    };

    // check internet
    if (isUserHasInternet) {
      getEvent();
    } else {
      getOfflineData();
    }
  }, []);

  // filter event by category
  useEffect(() => {
    console.log(selectedTitle);
    if (selectedTitle === "All") {
      setEventState(allEvents);
    } else {
      const getEventByCategory = eventState?.filter(
        (e) => e.eventCategory === selectedTitle,
      );
      setEventState(getEventByCategory);
    }
  }, [selectedTitle]);

  // Fetch & filter events for search
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      if (!studentToken || searchText.trim() === "") {
        setSearchSuggestion([]);
        return;
      }

      const allEvents = await getAllEvents(studentToken);
      const query = searchText.toLowerCase();

      const filtered = allEvents
        .filter((event: EventModel) =>
          event.eventTitle.toLowerCase().includes(query),
        )
        .sort((a: EventModel, b: EventModel) => {
          const aTitle = a.eventTitle.toLowerCase();
          const bTitle = b.eventTitle.toLowerCase();

          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;

          return aTitle.indexOf(query) - bTitle.indexOf(query);
        });

      setSearchSuggestion(filtered);
    };

    const fetchFilteredEventsOffline = async () => {
      if (!studentToken || searchText.trim() === "") {
        setSearchSuggestion([]);
        return;
      }

      const query = searchText.toLowerCase();

      const filtered = eventDataOffline
        .filter((event: EventModel) =>
          event.eventTitle.toLowerCase().includes(query),
        )
        .sort((a: EventModel, b: EventModel) => {
          const aTitle = a.eventTitle.toLowerCase();
          const bTitle = b.eventTitle.toLowerCase();

          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;

          return aTitle.indexOf(query) - bTitle.indexOf(query);
        });

      setSearchSuggestion(filtered);
    };

    if (isUserHasInternet) {
      fetchFilteredEvents();
    } else {
      fetchFilteredEventsOffline();
    }
  }, [searchText]);

  // Highlight matching letters
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <Text>{text}</Text>;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) return <Text>{text}</Text>;

    const endIndex = startIndex + query.length;
    return (
      <Text>
        {text.substring(0, startIndex)}
        <Text style={{ fontWeight: "bold", color: COLORS.Primary }}>
          {text.substring(startIndex, endIndex)}
        </Text>
        {text.substring(endIndex)}
      </Text>
    );
  };

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

  const isTodayEventDate = (eventDate: string): boolean => {
    // Normalize to YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // If eventDate already comes as YYYY-MM-DD
    return today === eventDate;
    // return today === today;
  };

  /*
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

  */

  const RenderEventItem = ({ item }: { item: EventModel }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
      if (isUserHasInternet) {
        const loadImage = async () => {
          console.log(item.eventImageUrl);
          try {
            const uri = await fetchEventImageById(
              item.eventImageUrl!,
              studentToken,
            );
            setImageUri(uri);
          } catch (error) {
            console.error(
              `❌ Failed to load image for event ${item.id}:`,
              error,
            );
          } finally {
            setLoadingImage(false);
          }
        };

        loadImage();
      } else {
        setLoadingImage(false);
      }
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
            {isTodayEventDate(item.eventDate) && (
              <Pressable
                style={styles.qrGeneratorbtn}
                onPress={() => {
                  router.push(`../OfficerScanner/${item.id}`);
                }}
              >
                <MaterialIcons name="qr-code-2" size={24} color="black" />
              </Pressable>
            )}

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
          {eventState?.length !== 0 ? (
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
