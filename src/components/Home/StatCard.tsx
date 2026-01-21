import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  count: string | number;
  color: string;
  iconColor: string;
}

const StatCard = ({ icon, label, count, color, iconColor }: StatCardProps) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default StatCard;