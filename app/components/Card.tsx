import { StyleSheet, View, ViewProps } from "react-native";
import { Shadows } from "../constants/Shadows";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = ViewProps;

export function Card({style, ...rest}: Props) {
    const colors = useThemeColors();
    return <View style={[style, styles.card, {backgroundColor: colors.grayWhite}]} {...rest}/>
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        overflow: "hidden",
        ...Shadows.dp2
    }
});