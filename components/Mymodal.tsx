import { useRouter } from "expo-router";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  redirectPath?: string; // ✅ you can pass your own path
  buttonLabel?: string;  // ✅ customizable button text
}

const Mymodal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  message = "Evaluation added successfully!",
  redirectPath = "/(tabs)/home",
  buttonLabel = "Go to Home",
}) => {
  const router = useRouter();

  const handlePress = () => {
    onClose();
    if (redirectPath) {
      router.push(redirectPath as any); // ✅ use your custom route
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: "green" }]}>
            Success 🎉
          </Text>
          <Text style={styles.modalText}>{message}</Text>

          <Pressable
            style={[styles.button, { backgroundColor: "green", marginTop: 15 }]}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Mymodal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
