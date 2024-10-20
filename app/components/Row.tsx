import { StyleSheet, View, ViewProps } from "react-native"

type Props = ViewProps & {
    gap?: number
}

export function Row({style, gap, ...rest}: Props) {
    return (
        <View style={[styles.rowStyle, style, gap ? {gap: gap} : undefined]} {...rest}/>
    )
}

const styles = StyleSheet.create({
    rowStyle: {
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
    }
});