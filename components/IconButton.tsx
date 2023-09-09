import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
export interface IconButtonParams {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}
export default function IconButton({ icon, label, onPress }: IconButtonParams) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={48} color="#fff" />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonLabel: {
    color: "#fff",
    marginTop: 12,
    fontSize: 32,
  },
});
