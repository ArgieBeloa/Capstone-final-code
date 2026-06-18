import { getAdminById } from "@/api/admin/controller";
import { approvalUpdateEvent, id } from "@/api/admin/utils";
import { EventModel } from "@/api/events/model";
import LinearbackGround from "@/components/LinearBackGround";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { approvalStyles } from "../styles/approval.styles";
import { mobileViewStyles } from "../styles/globalCss";

const approval = () => {
  const { studentToken } = useUser();
  const router = useRouter();

  const [approvalData, setApprovalData] = useState<approvalUpdateEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventModel>();
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [approveModal, setApproveModal] = useState<boolean>(false);

  // useLayoutEffect(() => {
  //   getAdminData();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      getAdminData();
    }, []),
  );

  // Functions
  const getAdminData = async () => {
    try {
      const adminData = await getAdminById(studentToken, id);
      setApprovalData(adminData.approvalUpdateEvents);
      console.log(adminData.approvalUpdateEvents);
    } catch (error) {
      console.log(error);
    }
  };

  //   NAVIGATIONS
  const handleEdit = (id: string) => {
    router.push(`../../adminEditEvent/${id}`);
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={approvalStyles.mainContainer}>
          <Text style={[mobileViewStyles.title, { textAlign: "center" }]}>
            Request for Approval
          </Text>

          <Animated.FlatList
            data={approvalData}
            style={{ flex: 1 }}
            renderItem={({ item }: { item: approvalUpdateEvent }) => {
              return (
                <View style={approvalStyles.card}>
                  <Text style={approvalStyles.title}>{item.eventTitle}</Text>

                  <Text style={approvalStyles.subtitle}>
                    Posted by: {item.whoPostedName}
                  </Text>

                  <Text style={approvalStyles.date}>{item.eventDate}</Text>

                  <View style={approvalStyles.buttonRow}>
                    <TouchableOpacity
                      style={approvalStyles.editBtn}
                      onPress={() => handleEdit(item.id)}
                    >
                      <Ionicons name="create-outline" size={18} color="#fff" />
                      <Text style={approvalStyles.btnText}>Edit</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      style={approvalStyles.approveBtn}
                      onPress={() => {
                        setApproveModal(true);
                        setSelectedEventId(item.id);
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#fff"
                      />
                      <Text style={approvalStyles.btnText}>Approve</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              );
            }}
            showsVerticalScrollIndicator={true}
          />

          {/* MODAL */}
          <Modal visible={approveModal} transparent animationType="fade">
            <View style={approvalStyles.modalOverlay}>
              <View style={approvalStyles.modalContent}>
                <Ionicons name="help-circle" size={60} color="#F59E0B" />

                <Text style={approvalStyles.modalTitle}>Approve Event?</Text>

                <Text style={approvalStyles.modalMessage}>
                  Are you sure you want to approve "{selectedEvent?.eventTitle}
                  "?
                </Text>

                <View style={approvalStyles.modalButtons}>
                  <TouchableOpacity
                    style={approvalStyles.cancelBtn}
                    onPress={() => setApproveModal(false)}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={approvalStyles.confirmBtn}
                    onPress={() => {
                      handleApprove(selectedEventId || "no id");
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Approve</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default approval;
