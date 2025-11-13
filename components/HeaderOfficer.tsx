import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Interface for event suggestions
interface EventSuggestionData {
  eventId: string;
  eventTitle: string;
}

interface HeaderOfficerProps {
  officerName: string;
  eventSuggestionData?: EventSuggestionData[];
  handleSendAnnouncement: (title: string, message: string) => Promise<void>;
}

const HeaderOfficer: React.FC<HeaderOfficerProps> = ({
  officerName = "No Name",
  eventSuggestionData = [],
  handleSendAnnouncement,
}) => {
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const [searchText, setSearchText] = useState("");
  const [searchEventId, setSearchEventId] = useState("");
  const [filteredEvents, setFilteredEvents] =
    useState<EventSuggestionData[]>(eventSuggestionData);
  const [showResults, setShowResults] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  // 🔔 Announcement modal states
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const router = useRouter();

  // 🔍 Filter events
  useEffect(() => {
    if (isSelecting) {
      setIsSelecting(false);
      return;
    }

    if (searchText.trim() === "") {
      setFilteredEvents(eventSuggestionData);
      setShowResults(false);
    } else {
      const lower = searchText.toLowerCase();
      const filtered = eventSuggestionData.filter((item) =>
        item.eventTitle.toLowerCase().includes(lower)
      );
      setFilteredEvents(filtered);
      setShowResults(true);
    }
  }, [searchText, eventSuggestionData]);

  const handleAnnouncer = () => {
    setShowAnnouncementModal(true);
  };

  const handleSearchText = () => {
    if (searchEventId) router.push(`../officerEventDetails/${searchEventId}`);
  };

  // ✨ Highlight search text
  const renderHighlightedText = (title: string) => {
    if (!searchText) return <Text style={styles.resultText}>{title}</Text>;
    const lowerTitle = title.toLowerCase();
    const lowerSearch = searchText.toLowerCase();
    const startIndex = lowerTitle.indexOf(lowerSearch);

    if (startIndex === -1)
      return <Text style={styles.resultText}>{title}</Text>;

    const endIndex = startIndex + searchText.length;
    const before = title.slice(0, startIndex);
    const match = title.slice(startIndex, endIndex);
    const after = title.slice(endIndex);

    return (
      <Text style={styles.resultText}>
        {before}
        <Text style={styles.highlight}>{match}</Text>
        {after}
      </Text>
    );
  };

  const handleSelectEvent = (item: EventSuggestionData) => {
    setIsSelecting(true);
    setSearchEventId(item.eventId);
    setSearchText(item.eventTitle);
    setShowResults(false);
  };

  // 📢 Send announcement
  const onSendAnnouncementPress = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      alert("Please fill out both title and message!");
      return;
    }

    await handleSendAnnouncement(announcementTitle, announcementMessage);
    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setShowAnnouncementModal(false);
  };

  return (
    <View style={{ justifyContent: "space-between" }}>
      {/* Header Row */}
      <View style={styles.headerContainer}>
        {/* 🧍 Officer Info */}
        <View style={styles.officerInfoContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetterName}</Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text
              style={styles.officerName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {officerName}
            </Text>
            <Text style={styles.officerRole}>Officer</Text>
          </View>
        </View>

        {/* 🔍 Search + 📣 */}
        <View style={styles.rightSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#777"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setShowResults(text.trim() !== "");
              }}
            />
            <TouchableOpacity onPress={handleSearchText}>
              <Ionicons name="search" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={handleAnnouncer}
          >
            <FontAwesome5 name="bullhorn" size={15} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 Search Results Dropdown */}
      {showResults && filteredEvents.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.eventId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectEvent(item)}
              >
                {renderHighlightedText(item.eventTitle)}
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 📢 Announcement Modal */}
      <Modal
        visible={showAnnouncementModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAnnouncementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>📢 Send Announcement</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              value={announcementTitle}
              onChangeText={setAnnouncementTitle}
            />

            <TextInput
              style={[styles.modalInput, { height: 100, textAlignVertical: "top" }]}
              placeholder="Message"
              multiline
              value={announcementMessage}
              onChangeText={setAnnouncementMessage}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setShowAnnouncementModal(false)} />
              <Button title="Send" onPress={onSendAnnouncementPress} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderOfficer;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  officerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 7,
    maxWidth: "55%", // prevents overflow
  },
  avatar: {
    backgroundColor: "grey",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
    color: "white",
    fontSize: 18,
  },
  officerName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000",
  },
  officerRole: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e2e2ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    width: 130,
    color: "#000",
  },
  resultsContainer: {
    position: "absolute",
    top: 65,
    left: 70,
    width: 220,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 9999,
    elevation: 10,
    maxHeight: 200,
    borderRadius: 8,
  },
  resultItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
