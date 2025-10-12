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
  handleSendAnnouncement: (title: string, message: string) => Promise<void>; // new prop
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

  const router = useRouter()

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
    // console.log("🔍 Search Title:", searchText);
    // console.log("🆔 Search ID:", searchEventId);
   router.push(`../officerEventDetails/${searchEventId}`)

  };

  // ✨ Highlight search
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

  // 📢 Local handler calls parent prop
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
    <View>
      {/* Header Row */}
      <View style={styles.headerContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetterName}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              if (text.trim() === "") setShowResults(false);
              else setShowResults(true);
            }}
          />
          <TouchableOpacity onPress={handleSearchText}>
            <Ionicons name="search" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 📣 Announcer Button */}
        <TouchableOpacity
          style={{ marginHorizontal: 10 }}
          onPress={handleAnnouncer}
        >
          <FontAwesome5 name="bullhorn" size={24} color="black" />
        </TouchableOpacity>
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
              style={[styles.modalInput, { height: 100, textAlignVertical: "top"}]}
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  avatar: {
    backgroundColor: "grey",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
    color: "white",
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e2e2ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  resultsContainer: {
    position: "absolute",
    top: 60,
    left: 60,
    right: 0,
    width: 200,
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
